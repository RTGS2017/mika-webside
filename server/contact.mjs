import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendMail } from "./smtp.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(envPath);

const needs = new Set(["seo", "growth", "ai", "content", "multilingual", "unsure"]);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const copy = {
  zh: {
    ok: "我们已经收到你的网站信息。确认邮件会发到你填写的邮箱。",
    bad: "请检查公司、姓名、邮箱、网站和需求是否填写完整。",
    missing: "邮件服务尚未配置，申请没有发出。",
    fail: "邮件没有发出，请稍后再试。"
  },
  en: {
    ok: "We have received the site. A confirmation email will go to the address you entered.",
    bad: "Check the company, name, email, website, and need.",
    missing: "Mail is not configured, so the request was not sent.",
    fail: "The email was not sent. Try again later."
  }
};

function text(lang, key) {
  return (copy[lang] || copy.en)[key];
}

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

export function validate(body) {
  const lang = body.lang === "zh" ? "zh" : "en";
  if (clean(body.company_website, 200)) {
    return { ok: false, status: 400, lang, message: text(lang, "bad") };
  }
  const lead = {
    company: clean(body.company, 120),
    name: clean(body.name, 80),
    email: clean(body.email, 160),
    website: clean(body.website, 300),
    need: clean(body.need, 40),
    lang
  };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  let urlOk = false;
  try {
    const url = new URL(lead.website);
    urlOk = url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    urlOk = false;
  }
  if (!lead.company || !lead.name || !emailOk || !urlOk || !needs.has(lead.need)) {
    return { ok: false, status: 400, lang, message: text(lang, "bad") };
  }
  return { ok: true, lead };
}

export async function deliver(lead) {
  const lang = lead.lang === "zh" ? "zh" : "en";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const receiver = process.env.CONTACT_RECEIVER || user;
  if (!user || !pass || !receiver) {
    return { ok: false, status: 503, message: text(lang, "missing") };
  }
  const when = new Date().toISOString();
  const admin = [
    `公司名称：${lead.company}`,
    `联系人：${lead.name}`,
    `邮箱：${lead.email}`,
    `网站：${lead.website}`,
    `需求：${lead.need}`,
    `提交时间：${when}`
  ].join("\n");
  const visitor = lang === "zh"
    ? "我们已经收到你的网站信息。\n\n我们会根据你提交的网站进行后续处理。\n\nMika"
    : "We have received your website information.\n\nWe will follow up based on the site you submitted.\n\nMika";
  const smtp = {
    host: process.env.SMTP_HOST || "smtp.qq.com",
    port: process.env.SMTP_PORT || "465",
    user,
    pass
  };
  try {
    await sendMail({ ...smtp, to: receiver, subject: "【Mika 官网新线索】新的免费扫描申请", text: admin });
    await sendMail({ ...smtp, to: lead.email, subject: "【Mika】已收到你的网站扫描申请", text: visitor });
  } catch (error) {
    return { ok: false, status: 502, message: text(lang, "fail") };
  }
  return { ok: true, status: 200, message: text(lang, "ok") };
}

function sendJson(res, status, message) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify({ ok: status < 300, message }));
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://127.0.0.1");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.normalize(path.join(root, pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

const port = Number(process.env.PORT || 8787);
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url.split("?")[0] === "/api/contact") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      let body = {};
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      } catch (error) {
        sendJson(res, 400, text("en", "bad"));
        return;
      }
      const checked = validate(body);
      if (!checked.ok) {
        sendJson(res, checked.status, checked.message);
        return;
      }
      const result = await deliver(checked.lead);
      sendJson(res, result.status, result.message);
    });
    return;
  }
  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }
  res.writeHead(405);
  res.end("method");
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(port, "127.0.0.1", () => {
    console.log(`listening ${port}`);
  });
}

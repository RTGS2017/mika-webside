import { connect } from "cloudflare:sockets";

const needs = new Set(["seo", "growth", "ai", "content", "multilingual", "unsure"]);
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

function validate(body) {
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

function b64(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

async function smtpSend(env, { to, subject, textBody }) {
  const host = env.SMTP_HOST || "smtp.qq.com";
  const port = Number(env.SMTP_PORT || 465);
  const socket = connect({ hostname: host, port }, { secureTransport: "on" });
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  async function readCode(expect) {
    while (true) {
      let index = buffer.indexOf("\r\n");
      while (index < 0) {
        const chunk = await reader.read();
        if (chunk.done) throw new Error("smtp closed");
        buffer += decoder.decode(chunk.value, { stream: true });
        index = buffer.indexOf("\r\n");
      }
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (line[3] === "-") continue;
      const code = Number(line.slice(0, 3));
      if (!expect.includes(code)) throw new Error(line);
      return line;
    }
  }

  async function write(line) {
    await writer.write(encoder.encode(line + "\r\n"));
  }

  await readCode([220]);
  await write("EHLO mikaovo.ai");
  await readCode([250]);
  await write("AUTH LOGIN");
  await readCode([334]);
  await write(b64(env.SMTP_USER));
  await readCode([334]);
  await write(b64(env.SMTP_PASS));
  await readCode([235]);
  await write(`MAIL FROM:<${env.SMTP_USER}>`);
  await readCode([250]);
  await write(`RCPT TO:<${to}>`);
  await readCode([250, 251]);
  await write("DATA");
  await readCode([354]);
  const stuffed = String(textBody)
    .replace(/\r?\n/g, "\r\n")
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
  const payload = [
    `From: Mika <${env.SMTP_USER}>`,
    `To: <${to}>`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    stuffed,
    "."
  ].join("\r\n");
  await write(payload);
  await readCode([250]);
  await write("QUIT");
  await writer.close();
}

function json(status, message, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return new Response(JSON.stringify({ ok: status < 300, message }), { status, headers });
}

function allowedOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  if (origin === "https://mikaovo.ai" || origin === "https://www.mikaovo.ai") return origin;
  return "";
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin || "https://mikaovo.ai",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/api/contact") {
      return json(404, "not found", origin);
    }
    let body = {};
    try {
      body = await request.json();
    } catch (error) {
      return json(400, text("en", "bad"), origin);
    }
    const checked = validate(body);
    if (!checked.ok) return json(checked.status, checked.message, origin);
    const lead = checked.lead;
    const receiver = env.CONTACT_RECEIVER || env.SMTP_USER;
    if (!env.SMTP_USER || !env.SMTP_PASS || !receiver) {
      return json(503, text(lead.lang, "missing"), origin);
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
    const visitor = lead.lang === "zh"
      ? "我们已经收到你的网站信息。\n\n我们会根据你提交的网站进行后续处理。\n\nMika"
      : "We have received your website information.\n\nWe will follow up based on the site you submitted.\n\nMika";
    try {
      await smtpSend(env, { to: receiver, subject: "【Mika 官网新线索】新的免费扫描申请", textBody: admin });
      await smtpSend(env, { to: lead.email, subject: "【Mika】已收到你的网站扫描申请", textBody: visitor });
    } catch (error) {
      return json(502, text(lead.lang, "fail"), origin);
    }
    return json(200, text(lead.lang, "ok"), origin);
  }
};

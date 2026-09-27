import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (name === "index.html") acc.push(p);
  }
  return acc;
}

const files = [
  ...walk("blog"),
  ...walk(path.join("zh", "blog")),
  ...walk("qa"),
  ...walk(path.join("zh", "qa")),
];
const problems = [];
const titles = new Map();
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  const h1 = html.match(/<h1[\s\S]*?<\/h1>/g) || [];
  if (h1.length !== 1) problems.push("h1 " + h1.length + " " + f);
  if (!html.includes('name="robots" content="index, follow')) problems.push("robots " + f);
  if (!html.includes('rel="canonical" href="https://mikaovo.ai/')) problems.push("canon " + f);
  for (const token of ["hreflang=\"en\"", "hreflang=\"zh-Hans\"", "hreflang=\"x-default\""]) {
    if (!html.includes(token)) problems.push("hreflang " + f);
  }
  const links = [...html.matchAll(/<a href="(\/[^"#]+)"/g)].map((m) => m[1]);
  const related = links.filter((h) => h.includes("/knowledge/") || h.includes("/blog/") || h.includes("/qa/"));
  if (related.length < 2) problems.push("links " + related.length + " " + f);
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  if (titles.has(title)) problems.push("dup title " + title);
  titles.set(title, f);
  if (html.includes("github.io")) problems.push("gh " + f);
  if (html.includes(">Q&A<")) problems.push("raw amp " + f);
}
const blogCards = (fs.readFileSync("blog/index.html", "utf8").match(/class="kc-card"/g) || []).length;
const qaCards = (fs.readFileSync("qa/index.html", "utf8").match(/class="kc-card"/g) || []).length;
const zhBlog = (fs.readFileSync("zh/blog/index.html", "utf8").match(/class="kc-card"/g) || []).length;
const zhQa = (fs.readFileSync("zh/qa/index.html", "utf8").match(/class="kc-card"/g) || []).length;
const sm = fs.readFileSync("sitemap.xml", "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const dup = locs.filter((l, i) => locs.indexOf(l) !== i);
const home = fs.readFileSync("index.html", "utf8");
const zh = fs.readFileSync("zh/index.html", "utf8");
console.log(JSON.stringify({
  files: files.length,
  blogCards, qaCards, zhBlog, zhQa,
  sitemap: locs.length,
  dup: dup.length,
  baidu: home.includes('baidu-site-verification" content="codeva-YhxGNuIWT5"'),
  rail: home.includes('class="mika-rail"') && zh.includes('class="mika-rail"'),
  knowledgeLink: home.includes('href="/knowledge/"'),
  problems: problems.length,
}, null, 2));
if (problems.length) console.log(problems.slice(0, 40).join("\n"));
if (dup.length || problems.length || blogCards !== 20 || qaCards !== 50) process.exit(1);

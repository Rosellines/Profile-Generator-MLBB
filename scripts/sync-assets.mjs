import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const catalogPath = path.join(ROOT, "skins-live.json");
const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
const concurrency = 8;

const slugify = (value) => String(value || "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const jobs = [];
for (const hero of catalog.heroes || []) {
  for (const skin of hero.skins || []) {
    if (!skin.asset || !/^https?:\/\//i.test(skin.asset)) continue;
    const ext = path.extname(new URL(skin.asset).pathname).toLowerCase() || ".png";
    const relative = path.join("assets", "skins", slugify(hero.name), `${slugify(skin.name)}${ext}`);
    jobs.push({ hero, skin, relative });
  }
}

let cursor = 0;
let completed = 0;
let failed = 0;

async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= jobs.length) return;
    const job = jobs[index];
    const destination = path.join(ROOT, job.relative);
    try {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      try {
        await fs.access(destination);
        job.skin.asset = job.relative.replaceAll(path.sep, "/");
        completed += 1;
        continue;
      } catch {}

      const response = await fetch(job.skin.asset, { redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      await fs.writeFile(destination, bytes);
      job.skin.asset = job.relative.replaceAll(path.sep, "/");
      completed += 1;
      if (completed % 25 === 0) console.log(`Downloaded ${completed}/${jobs.length}`);
    } catch (error) {
      failed += 1;
      console.warn(`Failed: ${job.hero.name} / ${job.skin.name}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
await fs.writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Done. ${completed} downloaded, ${failed} failed.`);

// After `tsc`: gives every import between the built files the version from index.html (dist/main.js?v=...), so a
// browser never mixes a new main.js with old cached modules. Run it after every build: `npm run build` does both.
//
// Only relative imports of .js files are changed ("./ui/dom.js" -> "./ui/dom.js?v=1.0.16"). Every file gets the same
// version, so each module still has one address (no module is loaded twice). Running it again is safe.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const docs = path.join(root, "docs");
const html = fs.readFileSync(path.join(docs, "index.html"), "utf8");
const m = html.match(/dist\/main\.js\?v=([^"'&\s]+)/);
if (!m) {
    console.error("add_version: no dist/main.js?v=... in docs/index.html");
    process.exit(1);
}
const version = m[1];

// from "./x.js" | import "./x.js" | import("./x.js") | export ... from "./x.js"  (an old ?v=... is replaced)
const spec = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"'?]+?\.js)(?:\?v=[^"']*)?\2/g;

let files = 0, changed = 0;
function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".js")) {
            const src = fs.readFileSync(p, "utf8");
            const out = src.replace(spec, (_, a, q, file) => `${a}${q}${file}?v=${version}${q}`);
            files++;
            if (out !== src) { fs.writeFileSync(p, out); changed++; }
        }
    }
}
walk(path.join(docs, "dist"));
console.log(`add_version: ${version} in the imports of ${changed} of ${files} files in docs/dist`);

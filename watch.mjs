// `npm run watch`: like `npx tsc --watch`, but after every compile it also runs add_version.mjs, so the
// imports in docs/dist always carry the version from index.html (tsc writes them without it).
// Changing the version in docs/index.html runs add_version.mjs again too, without a recompile.
//
// Stop with Ctrl+C.

import fs from "fs";
import path from "path";
import { spawn, execFileSync } from "child_process";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const html = path.join(root, "docs", "index.html");
const require = createRequire(import.meta.url);


function add_version() {
    try {
        execFileSync(process.execPath, [path.join(root, "add_version.mjs")], { cwd: root, stdio: "inherit" });
    } catch {
        // add_version.mjs already printed what went wrong; keep watching
    }
}


// tsc from this project's node_modules (the version in package.json), run with node itself:
// works the same on Windows, macOS and Linux, no shell needed
const tsc_bin = require.resolve("typescript/bin/tsc");
const tsc = spawn(process.execPath, [tsc_bin, "--watch", "--preserveWatchOutput"], {
    cwd: root,
    stdio: ["inherit", "pipe", "inherit"],
});

// tsc prints "... Found N errors. Watching for file changes." after every compile
// (it still writes the files when there are errors, so add the versions then too)
let buffer = "";
tsc.stdout.setEncoding("utf8");
tsc.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
        if (/Watching for file changes/.test(line)) add_version();
    }
});


// A new version in index.html: put it in the imports right away
let last_html = fs.readFileSync(html, "utf8");
let timer;
fs.watch(html, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {      // editors save in several steps: wait until it's done
        let now;
        try { now = fs.readFileSync(html, "utf8"); } catch { return; }
        if (now === last_html) return;
        last_html = now;
        console.log("index.html changed");
        add_version();
    }, 200);
});


tsc.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => { tsc.kill(); process.exit(0); });

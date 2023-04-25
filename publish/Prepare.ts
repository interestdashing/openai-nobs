import * as fs from "fs";
import * as path from "path";

// generate a dist package.json
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")).toString());
delete pkg.devDependencies;
delete pkg.scripts;
pkg.main = "index.js";
fs.writeFileSync(path.join(__dirname, "..", "dist", "package.json"), JSON.stringify(pkg, undefined, 4));

// copy the README.md from project
fs.writeFileSync(
    path.join(__dirname, "..", "dist", "README.md"),
    fs.readFileSync(path.join(__dirname, "..", "README.md"))
);

import * as fs from "fs";
import * as path from "path";

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")).toString());
delete pkg.devDependencies;
delete pkg.scripts;

fs.writeFileSync(path.join(__dirname, "..", "dist", "package.json"), JSON.stringify(pkg, undefined, 4));

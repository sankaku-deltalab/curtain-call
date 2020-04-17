import * as path from "path";
import * as fs from "fs";
import editJsonFile from "edit-json-file";

const editPackageJson = (packageName) => {
  const pkgPath = path.join("packages/", packageName, "package.json");
  const pkg = editJsonFile(pkgPath);

  pkg
    .set("main", "dist/index.js")
    .set("module", "dist/index.js")
    .set("types", "dist/index.d.ts")
    .set("scripts.prepare", "run-s build:clean build:tsc")
    .set("scripts.prepare:clean", "rimraf dist/")
    .set("scripts.prepare:tsc", "tsc")
    .save();
};

const saveTsconfig = (packageName) => {
  const tsconfigText = `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src"
  },
  "include": [
    "./src"
  ]
}`;
  const cfgPath = path.join("packages/", packageName, "tsconfig.json");
  fs.writeFileSync(cfgPath, tsconfigText);
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.length !== 1) throw new Error("arguments required");
  const re = /(@[\w-]*\/)+([\w-]*)/;
  const pkgName = args[0].replace(re, "$2");
  editPackageJson(pkgName);
  saveTsconfig(pkgName);
};

main();

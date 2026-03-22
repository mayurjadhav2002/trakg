import { build } from "esbuild";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const inputFile = path.join(process.cwd(), "src/scripts/trakg_script.min.ts");
const tempFile = path.join(process.cwd(), "src/scripts/.temp_tracker.ts");
const outputFile = path.join(process.cwd(), "script/trakg_script.min.js");
const Replacement_values: Record<string, string> = {
  SERVER_URL: process.env.BACKEND_URL!,
  API_VERSION: `api/${process.env.API_VERSION!}`,
};

async function buildTracker() {
  try {
    let code = fs.readFileSync(inputFile, "utf8");

    for (const key in Replacement_values) {
      const value = Replacement_values[key];
      const regex = new RegExp(`__${key}__`, "g");
      code = code.replace(regex, value);
    }

    fs.writeFileSync(tempFile, code);

    await build({
      entryPoints: [tempFile],
      outfile: outputFile,
      bundle: true,
      minify: true,
      platform: "browser",
      target: ["es2017"],
      format: "iife",
    });

    fs.unlinkSync(tempFile);

    console.log("✅ Tracker built successfully");
    console.log("📦 Output:", outputFile);
  } catch (err) {
    console.error("❌ Tracker build failed", err);
    process.exit(1);
  }
}

buildTracker();

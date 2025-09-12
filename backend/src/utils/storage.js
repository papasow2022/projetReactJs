import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "backend", "data");

async function ensureDataDirExists() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // ignore
  }
}

export async function readJson(fileName, defaultValue) {
  await ensureDataDirExists();
  const filePath = path.join(dataDir, fileName);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) {
      return defaultValue;
    }
    throw err;
  }
}

export async function writeJson(fileName, data) {
  await ensureDataDirExists();
  const filePath = path.join(dataDir, fileName);
  const tmpPath = `${filePath}.tmp`;
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(tmpPath, json, "utf-8");
  await fs.rename(tmpPath, filePath);
  return true;
}


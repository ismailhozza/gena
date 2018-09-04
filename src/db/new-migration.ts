import path from "path";
import fs from "fs";

const prefix = new Date().getTime();
const filePath = path.join(__dirname, "migrations", `${prefix}_rename.ts`);
fs.writeFileSync(filePath, "");
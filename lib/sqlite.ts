import { execSync } from "child_process"
import { mkdir, writeFile } from "fs/promises";
import path from 'path';

// export function runQuery(query: string) {
//   const result = execSync(`sqlite3 database.db "${query}"`).toString()
//   return JSON.parse(result)
// }

export function runQuery(query: string) {
  const result = execSync(
    `sqlite3 -json database.db "${query}"`,
    { encoding: "utf-8" }
  )

  return JSON.parse(result || "[]")
}


export async function uploadFile(file: File, type:string, model:string) {
  if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', type, model);
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      const imageUrl = `/uploads/${type}/${model}/${fileName}`;
      return imageUrl;
  }
  return null;
  
}
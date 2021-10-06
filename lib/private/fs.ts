import * as fs from "fs";
import { join } from "path";

const fsHasRmSync = 'rmSync' in fs;  // available since node@14

export function emptyDirSync(path: string): void {
  for (const dirent of fs.readdirSync(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      if (fsHasRmSync) {
        (fs as any).rmSync(join(path, dirent.name), { force: true, recursive: true });
      } else {
        // Drop this branch after node@12 reaches EOL
        (fs as any).rmdirSync(join(path, dirent.name), { recursive: true });
      }
    } else {
      fs.unlinkSync(join(path, dirent.name));
    }
  }
}


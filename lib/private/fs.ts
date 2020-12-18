import * as fs from "fs";
import { join } from "path";

export function emptyDirSync(path: string): void {
  for(const dirent of fs.readdirSync(path, { withFileTypes: true })) {
    if(dirent.isDirectory()) {
      fs.rmdirSync(join(path, dirent.name), { recursive: true });
    } else {
      fs.unlinkSync(join(path, dirent.name));
    }
  }
}

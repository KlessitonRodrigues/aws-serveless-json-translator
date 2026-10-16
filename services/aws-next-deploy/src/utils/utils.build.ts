import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export const copyIfExists = (from: string, to: string) => {
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, to, { recursive: true });
};

export const buildNextApp = (appPath: string) => {
  if (!fs.existsSync(path.join(appPath, 'package.json'))) {
    throw new Error(`Next.js app not found at ${appPath}`);
  }
  execSync('yarn next build', { cwd: appPath, stdio: 'inherit' });
  const standalone = path.join(appPath, '.next/standalone');
  if (!fs.existsSync(standalone)) {
    throw new Error("Missing .next/standalone. Set `output: 'standalone'` in next.config");
  }
  return standalone;
};

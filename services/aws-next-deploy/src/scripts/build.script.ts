import * as fs from 'fs';
import * as path from 'path';

import dotenv from '../constants/constants.environment';
import { NEXT_SERVER_PORT, buildPaths } from '../constants/constants.resources';
import { buildNextApp, copyIfExists } from '../utils/utils.build';

// Builds the Next.js app and splits the output into the Lambda bundle and the S3 assets
const main = () => {
  const appPath = dotenv.NEXT_APP_PATH;
  const standalone = buildNextApp(appPath);

  fs.rmSync(path.dirname(buildPaths.lambdaDir), { recursive: true, force: true });
  fs.mkdirSync(buildPaths.assetsDir, { recursive: true });

  fs.cpSync(standalone, buildPaths.lambdaDir, { recursive: true });
  copyIfExists(path.join(appPath, '.next/static'), path.join(buildPaths.lambdaDir, '.next/static'));
  copyIfExists(path.join(appPath, 'public'), path.join(buildPaths.lambdaDir, 'public'));

  copyIfExists(path.join(appPath, '.next/static'), path.join(buildPaths.assetsDir, '_next/static'));
  copyIfExists(path.join(appPath, 'public'), buildPaths.assetsDir);

  const runScript = `#!/bin/bash\nPORT=${NEXT_SERVER_PORT} HOSTNAME=0.0.0.0 exec node server.js\n`;
  fs.writeFileSync(path.join(buildPaths.lambdaDir, 'run.sh'), runScript, { mode: 0o755 });
};

main();

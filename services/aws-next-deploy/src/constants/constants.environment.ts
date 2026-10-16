import '../config/config.dotenv'; // sort-imports-ignore

import * as path from 'path';

const dotenv = {
  STACK_NAME: process.env.STACK_NAME || 'next-deploy',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  NEXT_APP_PATH: path.resolve(
    __dirname,
    '../..',
    process.env.NEXT_APP_PATH || '../../apps/next-exibiton-app',
  ),
};

export default dotenv;

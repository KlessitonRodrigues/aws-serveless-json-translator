import * as path from 'path';

import dotenv from './constants.environment';

export const resourceNames = {
  assetsBucket: dotenv.STACK_NAME + '-assets-bucket',
  assetsDeployment: dotenv.STACK_NAME + '-assets-deployment',
  logGroup: dotenv.STACK_NAME + '-log-group',
  serverLambda: dotenv.STACK_NAME + '-server-lambda',
  distribution: dotenv.STACK_NAME + '-distribution',
};

export const buildPaths = {
  lambdaDir: path.resolve(__dirname, '../../dist/lambda'),
  assetsDir: path.resolve(__dirname, '../../dist/assets'),
};

// Public AWS Lambda Web Adapter layer, runs the Next.js standalone server on Lambda
export const lambdaWebAdapterLayerArn = (region: string) =>
  `arn:aws:lambda:${region}:753240598075:layer:LambdaAdapterLayerX86:25`;

export const NEXT_SERVER_PORT = '8080';
export const NEXT_STATIC_PATHS = ['/_next/static/*', '/static/*'];

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import {
  NEXT_SERVER_PORT,
  buildPaths,
  lambdaWebAdapterLayerArn,
  resourceNames,
} from '../constants/constants.resources';

export class NextServerLambda extends lambda.Function {
  constructor(scope: cdk.Stack, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.serverLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.X86_64,
      handler: 'run.sh',
      code: lambda.Code.fromAsset(buildPaths.lambdaDir),
      functionName: resourceNames.serverLambda,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          scope,
          resourceNames.serverLambda + '-adapter',
          lambdaWebAdapterLayerArn(scope.region),
        ),
      ],
      environment: {
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/bootstrap',
        AWS_LWA_PORT: NEXT_SERVER_PORT,
        AWS_LWA_INVOKE_MODE: 'response_stream',
      },
      logGroup,
    });
  }
}

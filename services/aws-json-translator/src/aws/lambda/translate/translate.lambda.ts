import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';

import { resourceNames } from '../../../constants/constants.resources';
import { environment } from '../../../utils/utils.lambda';

export class TranslateJsonLambda extends nodeLambda.NodejsFunction {
  constructor(scope: cdk.Stack, environment: environment, logGroup?: cdk.aws_logs.LogGroup) {
    super(scope, resourceNames.translateJsonLambda, {
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(60),
      entry: __dirname + '/translate.service.ts',
      handler: 'translateJsonService',
      functionName: resourceNames.translateJsonLambda,
      environment,
      logGroup,
    });
  }
}

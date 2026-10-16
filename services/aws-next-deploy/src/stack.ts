import './config/config.dotenv'; // sort-imports-ignore

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

import { NextDistribution } from './aws/next.distribution';
import { NextServerLambda } from './aws/next.lambda';
import dotenv from './constants/constants.environment';
import { buildPaths, resourceNames } from './constants/constants.resources';

export class NextDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, props?: cdk.StackProps) {
    super(scope, dotenv.STACK_NAME, props);

    const logGroup = new cdk.aws_logs.LogGroup(this, resourceNames.logGroup, {
      logGroupName: resourceNames.logGroup,
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const bucket = new s3.Bucket(this, resourceNames.assetsBucket, {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const serverLambda = new NextServerLambda(this, logGroup);
    const serverUrl = serverLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });

    const distribution = new NextDistribution(this, bucket, serverUrl);

    new s3deploy.BucketDeployment(this, resourceNames.assetsDeployment, {
      sources: [s3deploy.Source.asset(buildPaths.assetsDir)],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: 'https://' + distribution.distributionDomainName,
    });
  }
}

const app = new cdk.App();
new NextDeployStack(app);

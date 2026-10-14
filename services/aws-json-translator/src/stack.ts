import './config/config.dotenv'; // sort-imports-ignore

import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

import dotenv from './constants/constants.environment';
import { resourceNames } from './constants/constants.resources';
import { TranslateAPIGateway } from './aws/gateway/translate.gateway';
import { TranslateJsonLambda } from './aws/lambda/translate/translate.lambda';
import { addCorsPreflight } from './utils/utils.aws';
import { environment } from './utils/utils.lambda';

export class JsonTranslatorStack extends cdk.Stack {
  constructor(scope: cdk.App, props?: cdk.StackProps) {
    super(scope, dotenv.STACK_NAME, props);

    const logGroup = new cdk.aws_logs.LogGroup(this, resourceNames.logGroup, {
      logGroupName: resourceNames.logGroup,
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const lambdaEnv: environment = { STACK_NAME: dotenv.STACK_NAME };
    const translateLambda = new TranslateJsonLambda(this, lambdaEnv, logGroup);
    translateLambda.addToRolePolicy(
      new iam.PolicyStatement({ actions: ['translate:TranslateText'], resources: ['*'] }),
    );

    const api = new TranslateAPIGateway(this);
    const route = api.root.addResource('translate');
    route.addMethod('POST', new gateway.LambdaIntegration(translateLambda));
    addCorsPreflight(route);
  }
}

const app = new cdk.App();
new JsonTranslatorStack(app);

import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

import { resourceNames } from '../../constants/resources';

export class TranslateAPIGateway extends gateway.RestApi {
  constructor(scope: cdk.Stack) {
    super(scope, resourceNames.translateApiGateway, {
      restApiName: resourceNames.translateApiGateway,
    });
  }
}

import dotenv from './environment';

export const resourceNames = {
  translateApiGateway: dotenv.STACK_NAME + '-translate-api-gateway',
  logGroup: dotenv.STACK_NAME + '-log-group',
  translateJsonLambda: dotenv.STACK_NAME + '-translate-json-lambda',
};

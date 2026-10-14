import { ErrorDto } from '../aws/lambda/common/api.dto';
import { apiMessages } from '../constants/constants.messages';

export type APIGatewayHandler = (event: any) => Promise<any>;

export type environment = { [key: string]: string };

export type APIGatewayResponse = {
  statusCode: number;
  body: string;
  headers: Record<string, string | number | boolean>;
};

export const createResponse = (
  code: number,
  data: any,
  headers?: Record<string, string>,
): APIGatewayResponse => ({
  statusCode: code,
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,lang',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    ...headers,
  },
});

export const badRequest = (details: unknown) => {
  return createResponse(400, ErrorDto.create({ message: apiMessages.INVALID_REQUEST, details }));
};

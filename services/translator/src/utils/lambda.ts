import { ErrorDto } from '../aws/lambda/common/api.dto';
import { apiMessages } from '../constants/apiMessages';

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

export const badRequest = (details: unknown) =>
  createResponse(400, ErrorDto.create({ ...apiMessages.INVALID_REQUEST, details }));

export const internalError = (err: any) => {
  console.error(err);
  return createResponse(
    500,
    ErrorDto.create({ details: err?.message, ...apiMessages.INTERNAL_SERVER_ERROR }),
  );
};

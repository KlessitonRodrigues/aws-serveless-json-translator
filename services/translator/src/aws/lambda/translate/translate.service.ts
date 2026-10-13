import { apiMessages } from '../../../constants/apiMessages';
import {
  APIGatewayHandler,
  badRequest,
  createResponse,
  internalError,
} from '../../../utils/lambda';
import { SuccessDto } from '../common/api.dto';
import { TranslateJsonDto } from './translate.dto';
import { createTranslator, translateJson } from './translate.engine';

export const translateJsonService: APIGatewayHandler = async event => {
  try {
    let body: unknown;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return badRequest('Body must be valid JSON');
    }

    const parsed = TranslateJsonDto.schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.flatten());

    const { json, sourceLanguage, targetLanguage } = parsed.data;
    const { result, translatedCount } = await translateJson(
      json,
      createTranslator(sourceLanguage, targetLanguage),
    );

    return createResponse(
      200,
      SuccessDto.create({ ...apiMessages.SUCCESS, data: { json: result, translatedCount } }),
    );
  } catch (err: any) {
    return internalError(err);
  }
};

import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

import dotenv from '../../../constants/constants.environment';
import { apiMessages } from '../../../constants/constants.messages';
import { APIGatewayHandler, badRequest, createResponse } from '../../../utils/utils.lambda';
import { SuccessDto } from '../common/api.dto';
import { TranslateJsonDto } from './translate.dto';

export const translateJsonService: APIGatewayHandler = async event => {
  try {
    const body = JSON.parse(event.body || '{}');
    const parsed = TranslateJsonDto.schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.flatten());

    const { json, sourceLanguage, targetLanguage } = parsed.data;

    const separator = ' | ';
    const jsonObj = JSON.parse(String(json));
    const jsonStr = Object.values(jsonObj).join(separator);

    const client = new TranslateClient({ region: dotenv.AWS_REGION });
    const command = new TranslateTextCommand({
      Text: jsonStr,
      SourceLanguageCode: sourceLanguage,
      TargetLanguageCode: targetLanguage,
    });
    const response = await client.send(command);
    const translatedText = response.TranslatedText ?? '';

    const newJsonObj = Object.fromEntries(
      Object.keys(jsonObj).map((key, index) => [key, translatedText.split(separator)[index] ?? '']),
    );

    return createResponse(
      200,
      SuccessDto.create({
        message: apiMessages.SUCCESS,
        data: { translatedJson: JSON.stringify(newJsonObj) },
      }),
    );
  } catch (err: any) {
    return badRequest(err);
  }
};

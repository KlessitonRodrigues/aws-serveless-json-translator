import axios from 'axios';
import { randomUUID } from 'crypto';

import dotenv from '../../../constants/constants.environment';
import { apiMessages } from '../../../constants/constants.messages';
import { TranslateJsonDto } from './translate.dto';

describe('Translate API', () => {
  const baseURL = dotenv.TEST_API_URL;
  if (!baseURL) throw new Error('missing TEST_API_URL');
  const apiClient = axios.create({ baseURL });

  const testId = randomUUID().replace(/-/g, '');
  const testJson = JSON.stringify({
    message1: 'Hello, world!',
    message2: 'How are you?',
    message3: 'Goodbye!',
  });

  const signUpDto: TranslateJsonDto = {
    json: testJson,
    sourceLanguage: 'en',
    targetLanguage: 'es',
  };

  it('should translate JSON and return 200 status', async () => {
    const response = await apiClient.post('/translate', signUpDto);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({ message: apiMessages.SUCCESS });
  });

  it('should return 400 when translating with invalid JSON', async () => {
    await expect(
      apiClient.post('/translate', {
        json: 'invalid-json',
        sourceLanguage: 'en',
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should return 400 when translating with missing fields', async () => {
    await expect(
      apiClient.post('/translate', {
        json: testJson,
        sourceLanguage: 'en',
      }),
    ).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should return 400 when translating with empty JSON', async () => {
    await expect(
      apiClient.post('/translate', {
        json: '{}',
        sourceLanguage: 'en',
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('should return 400 when translating with empty target language', async () => {
    await expect(
      apiClient.post('/translate', {
        json: testJson,
        sourceLanguage: 'en',
        targetLanguage: '',
      }),
    ).rejects.toMatchObject({
      response: { status: 400 },
    });
  });
});

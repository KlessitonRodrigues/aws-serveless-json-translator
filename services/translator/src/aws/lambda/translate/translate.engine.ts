import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

import dotenv from '../../../constants/environment';

export type TranslateText = (text: string) => Promise<string>;

const CONCURRENCY = 5;

export const createTranslator = (
  sourceLanguage: string,
  targetLanguage: string,
  client = new TranslateClient({ region: dotenv.AWS_REGION }),
): TranslateText => {
  return async text => {
    const res = await client.send(
      new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: sourceLanguage,
        TargetLanguageCode: targetLanguage,
      }),
    );
    return res.TranslatedText ?? text;
  };
};

const collectStrings = (value: unknown, found: Set<string>) => {
  if (typeof value === 'string') {
    if (value.trim()) found.add(value);
  } else if (Array.isArray(value)) {
    value.forEach(item => collectStrings(item, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(item => collectStrings(item, found));
  }
};

const rebuild = (value: unknown, map: Map<string, string>): unknown => {
  if (typeof value === 'string') return map.get(value) ?? value;
  if (Array.isArray(value)) return value.map(item => rebuild(item, map));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rebuild(v, map)]));
  }
  return value;
};

// Translates only string values; keys, numbers, booleans and nulls are preserved.
export const translateJson = async (json: unknown, translate: TranslateText) => {
  const strings = new Set<string>();
  collectStrings(json, strings);

  const queue = [...strings];
  const map = new Map<string, string>();
  const worker = async () => {
    for (let text = queue.shift(); text !== undefined; text = queue.shift()) {
      map.set(text, await translate(text));
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));

  return { result: rebuild(json, map), translatedCount: strings.size };
};

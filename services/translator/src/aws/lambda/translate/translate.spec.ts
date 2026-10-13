import { translateJson } from './translate.engine';
import { translateJsonService } from './translate.service';

describe('translateJson', () => {
  it('translates only string values and preserves structure', async () => {
    const translate = jest.fn(async (t: string) => t.toUpperCase());
    const input = { a: 'hello', b: ['x', 1, null, true], c: { d: 'hello', e: '  ' } };

    const { result, translatedCount } = await translateJson(input, translate);

    expect(result).toEqual({ a: 'HELLO', b: ['X', 1, null, true], c: { d: 'HELLO', e: '  ' } });
    expect(translatedCount).toBe(2);
    expect(translate).toHaveBeenCalledTimes(2);
  });
});

describe('translateJsonService', () => {
  it('returns 400 for invalid body', async () => {
    const res = await translateJsonService({ body: JSON.stringify({ json: {} }) });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await translateJsonService({ body: '{' });
    expect(res.statusCode).toBe(400);
  });
});

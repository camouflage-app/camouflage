export function expandDotNotation<T>(obj: DotNotationAnswers): T {
  const result: any = {};
  for (const flatKey in obj) {
    const value = obj[flatKey];
    const keys = flatKey.split(".");
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = acc[key] || {};
      }
      return acc[key];
    }, result);
  }
  return result as T;
}

export type DotNotationAnswers = Record<string, string | number | boolean | undefined>;
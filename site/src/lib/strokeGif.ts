const BISHUN_BASE_URL = "https://bishun.net/assets/bishun/donghua";

const hanRegex = /\p{Script=Han}/u;

export const getStrokeGifUrl = (char: string): string | null => {
  const firstChar = Array.from(char)[0] ?? "";
  if (!firstChar || !hanRegex.test(firstChar)) {
    return null;
  }

  const codePoint = firstChar.codePointAt(0);
  if (codePoint === undefined) {
    return null;
  }

  return `${BISHUN_BASE_URL}/bishundonghua-${codePoint}.gif`;
};


/*
 * Copyright 2022 Objectiv B.V.
 */

/**
 * Generates a v4 UUID. Automatically picks the best available implementation:
 *  - `crypto` available, `randomUUID` available: `uuidv4_Crypto_RandomUUID`.
 *  - `crypto` available, `randomUUID` not available, `getRandomValues` available: `uuidv4_Crypto_GetRandomValues`.
 *  - `crypto` not available: `uuidv4_DateNow_MathRandom`.
 *
 * The different implementations are also callable individually:
 *  - uuidv4.uuidv4_Crypto_RandomUUID()
 *  - uuidv4.uuidv4_Crypto_GetRandomValues()
 *  - uuidv4.uuidv4_DateNow_MathRandom()
 */
export function uuidv4() {
  const crypto = globalThis.crypto;

  if(crypto) {
    if(crypto['randomUUID']) {
      return uuidv4.uuidv4_Crypto_RandomUUID();
    }

    if(crypto['getRandomValues']) {
      return uuidv4.uuidv4_Crypto_GetRandomValues();
    }
  }

  return uuidv4.uuidv4_DateNow_MathRandom();
}

/**
 * The most basic implementation is an alias of `crypto.randomUUID`
 */
uuidv4.uuidv4_Crypto_RandomUUID = () => {
  globalThis.crypto.randomUUID()
}

/**
 * Kudos to Robert Kieffer (https://github.com/broofa), co-author of the uuid js module, for sharing this on SO.
 * Source:
 *  https://stackoverflow.com/a/2117523
 */
uuidv4.uuidv4_Crypto_GetRandomValues = () => {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (character: string) => {
    const number = parseInt(character);
    return (number ^ (globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (number / 4)))).toString(16);
  });
}

/**
 * A simplistic `Date.now()` & `Math.random()` based pseudo random UUID v4.
 * Math.random is not as bad as it used to be:
 *  https://v8.dev/blog/math-random
 */
uuidv4.uuidv4_DateNow_MathRandom = () => {
  const rng = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
  return [rng.substring(0, 8), rng.substring(8, 12), '4000-8' + rng.substring(13, 16), rng.substring(16, 28)].join('-');
}

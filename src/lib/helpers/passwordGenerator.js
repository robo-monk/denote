import { wordList } from "./words.js";

export const secureRandom = () => crypto.getRandomValues(new Uint32Array(1))[0]/2**32

export const secureRandomInt = (min = 0, max = 1) => Math.floor(secureRandom() * (max + 1 - min) + min)

export function getRandomWords(len = 32) {
    let words = (new Array(len)).fill(0).map(() => wordList[secureRandomInt(0, wordList.length)])
    return words.join(' ').trim();
}

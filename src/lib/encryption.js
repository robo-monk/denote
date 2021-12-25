import { AES, enc } from "crypto-js";

function encrypt(data, key, repetitions=8) {
    let ciphertext = AES.encrypt(data, key).toString();
    if (repetitions > 1) return encrypt(ciphertext, key, repetitions-1);
    return ciphertext;
}

function decrypt(ciphertext, key, repetitions=8) {
    let text = AES.decrypt(ciphertext, key).toString(enc.Utf8);
    if (repetitions > 1) return decrypt(text, key, repetitions-1);
    return text;
}

function encryptObj(obj, key, repetitions=8) {
    return encrypt(JSON.stringify(obj), key, repetitions);
}

function decryptObj(objDigest, key, repetitions=8) {
    return JSON.parse(decrypt(objDigest, key, repetitions));
}


export {
    encrypt, decrypt, encryptObj, decryptObj
}

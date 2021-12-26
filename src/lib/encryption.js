import { AES, enc, SHA512 } from "crypto-js";

/*
    NOTES: 
    It's almost pointless to apply AES multiple times
*/

function hash(data) {
    return SHA512(data).toString();
}

function encrypt(data, key, repetitions=3) {
    // return data;
    let ciphertext = AES.encrypt(data, key).toString();
    if (repetitions > 0) return encrypt(ciphertext, key, repetitions-1);
    return ciphertext;
}

function decrypt(ciphertext, key, repetitions=3) {
    // return ciphertext
    let text = AES.decrypt(ciphertext, key).toString(enc.Utf8);
    if (repetitions > 0) return decrypt(text, key, repetitions-1);
    return text;
}

function encryptObj(obj, key, repetitions=3) {
    return encrypt(JSON.stringify(obj), key, repetitions);
}

function decryptObj(objDigest, key, repetitions=3) {
    let ret = {}
    try {
        ret = JSON.parse(decrypt(objDigest, key, repetitions))
    } catch(e){
        console.warn("not a json obj")
    }

    return ret;
}


export {
    encrypt, decrypt, encryptObj, decryptObj, hash
}

import { encryptObj, decryptObj } from "./encryption";

const storage = localStorage;
const storageKey = "Ironic."
const secretKey = "123"

function _data() {
    return storage.getItem(storageKey) ? decryptObj(storage.getItem(storageKey), secretKey) : {};
}

function _save(data) {
    console.log("dataaa", data)
    return storage.setItem(storageKey, encryptObj(data, secretKey));
}

function get(name) {
    return _data()[name];
}

function put(value, name) {
    _save(Object.assign(_data(), {
        [name]: value
    }));
}

export {
    get, put
}

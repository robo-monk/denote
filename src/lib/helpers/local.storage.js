import { encryptObj, decryptObj } from './encryption';

const storage = localStorage;
const storageKey = 'Denote.';
const secretKey = '123';

function _data() {
	return storage.getItem(storageKey)
		? decryptObj(storage.getItem(storageKey), secretKey, 0)
		: {};
}

function _save(data) {
	return storage.setItem(storageKey, encryptObj(data, secretKey, 0));
}

function get(name) {
	return _data()[name];
}

function put(value, name) {
	_save(
		Object.assign(_data(), {
			[name]: value,
		})
	);
}

export { get, put };

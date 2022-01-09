import { safeJoin, safeSplit } from './helpers/utilities';
import { hash } from './helpers/encryption.js';
// import * as local from './lib/local.storage.js';
// import * as _web3Sstorage from './lib/web3.storage.js';
// window.web3 = Object.assign(window.web3 || {}, { storage: _web3Sstorage });

export class Account {
	constructor(name, sk, pk) {
		this.name = name;
		this.sk = sk;
		this.pk = pk;
	}

	sign(str) {
		return hash(safeJoin(this.sk, this.name, str));
	}

    get signature() {
        return this.sign(this.name);
    }

    confirm(signature, target) {
        return hash(safeJoin(this.sk, this.name, target)) === signature;
    }

    static fromObj(obj) {
        return new Account(obj.name, obj.sk, obj.pk);
    }

}

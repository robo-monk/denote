import { safeJoin, safeSplit } from './utilities';
import { hash } from './encryption.js';

export class Account {
	constructor(name, sk, pk) {
		this.name = name;
		this.sk = sk;
		this.pk = pk;
	}

	sign(str) {
		return hash(safeJoin(this.sk, this.name, str));
	}

    confirm(signature, target) {
        return hash(safeJoin(this.sk, this.name, target)) === signature;
    }

    static fromObj(obj) {
        return new Account(obj.name, obj.sk, obj.pk);
    }

}

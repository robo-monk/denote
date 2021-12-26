import { v4 as uuidv4 } from 'uuid';

export class Service {
	constructor({ name, cid, uuid = uuidv4(), details, username, icon, password }) {
		Object.assign(this, {
			uuid,
            cid,
			name,
			details,
			icon,
            username,
            password
		});
	}

	static fromObj(obj) {
		return new Service(obj);
	}
}

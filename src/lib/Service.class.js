import { v4 as uuidv4 } from 'uuid';

export class Service {
	constructor({ name, cid, uuid = uuidv4(), description, icon }) {
		Object.assign(this, {
			uuid,
            cid,
			name,
			description,
			icon,
		});
	}

	static fromObj(obj) {
		return new Service(obj);
	}
}

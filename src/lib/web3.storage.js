import { Web3Storage } from 'web3.storage';
import { v4 as uuidv4 } from 'uuid';

const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlGNTA0MmJjNzk4RjQxOEJmNkMwZGNiMEExMjU5Y2FEM0RCOTRENzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDA0NDg4MjM0NjYsIm5hbWUiOiJpcm9uaWMtcGFzc3dvcmQtbWFuYWdlciJ9.P4GyOS9rL29eRYQvmjocO3nZKcm9VKJO5fOPYgMj_mA';

const client = new Web3Storage({ token });

function blobToFile(blob, fileName) {
	blob.lastModifiedDate = new Date();
	blob.name = fileName;
	return blob;
}

export async function list(cb, condition) {
	const files = [];
	for await (const u of client.list()) {
		if (!condition || condition(u)) {
			files.push(u);
			if (cb) cb(u, files);
		}
	}
	return files;
}

export async function put(obj, name = uuidv4()) {
	console.log(`[web3.storage] > putting`, obj, 'as', name);
	const fileContent = JSON.stringify(obj);
	const blob = new Blob([fileContent], { type: 'application/json' });
	console.log('[web3.storage] > blob', blob);

	console.log('[web3.storage] > uploading to IPFS...');
	console.time('[web3.storage] > uploading to IPFS...');
	const cid = await client.put([blobToFile(blob, name)], {
		name,
		maxRetries: 3,
	});

	console.timeEnd('[web3.storage] > uploading to IPFS...');
	console.log(`[web3.storage] > cid`, cid);
	console.log(`https://ipfs.io/ipfs/${cid}/${name}`);
}

export async function getFiles(cid) {
	const res = await client.get(cid);
	if (res.ok) return await res.files();
	return [];
}

export async function get(cid, name = null) {
	console.log(`[web3.storage] > getting`, cid, '/', name);
	console.time('[web3.storage] > quering IPFS...');
	const files = await getFiles(cid);
	console.timeEnd('[web3.storage] > quering IPFS...');
	console.log(`[web3.storage] > got`, files.length, 'files');

	const fileObj =
		name === null ? files[0] : files.find((f) => f.name === name);
	const text = fileObj ? await fileObj.text() : null;
	let ret = text;
	try {
		ret = JSON.parse(text);
	} catch (e) {
		console.warn('[web3.storage] > file is not a valid JSON');
	}
	console.log(`[web3.storage] > received:`, ret);
	return ret;
}

import { Web3Storage } from 'web3.storage';
import { v4 as uuidv4 } from 'uuid';
import { encryptObj, decryptObj, encrypt, decrypt } from './encryption';
import { safeJoin, safeSplit } from "./utilities";

const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlGNTA0MmJjNzk4RjQxOEJmNkMwZGNiMEExMjU5Y2FEM0RCOTRENzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDA0NDg4MjM0NjYsIm5hbWUiOiJpcm9uaWMtcGFzc3dvcmQtbWFuYWdlciJ9.P4GyOS9rL29eRYQvmjocO3nZKcm9VKJO5fOPYgMj_mA';

const client = new Web3Storage({ token });
const sk = '458024994350udf9ua0d9f7af098a';

function blobToFile(blob, fileName) {
	blob.lastModifiedDate = new Date();
	blob.name = fileName;
	return blob;
}

async function list(cb, condition) {
	const files = [];
	const deletedCids = [];
	for await (const u of client.list()) {
		if (safeSplit(u.name)[0] === 'destroyer') {
			deletedCids.push(decrypt(safeSplit(u.name)[1], sk))
		} else if (!deletedCids.includes(u.cid) && (!condition || condition(u))) {
			files.push(u);
			if (cb) cb(u, files);
		}
	}
	return files;
}

async function put(obj, name = uuidv4()) {
	console.log(`[web3.storage] > putting`, obj, 'as', name);
	// const fileContent = JSON.stringify(obj);
	const fileContent = encryptObj(obj, sk);
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

async function getFiles(cid) {
	const res = await client.get(cid);
	if (res.ok) return await res.files();
	return [];
}

async function get(cid, name = null) {
	console.log(`[web3.storage] > getting`, cid, '/', name);
	console.time(`[web3.storage] > quering IPFS > [${cid}]`);
	const files = await getFiles(cid);
	console.timeEnd(`[web3.storage] > quering IPFS > [${cid}]`);
	console.log(`[web3.storage] > got`, files.length, 'files');

	const fileObj =
		name === null ? files[0] : files.find((f) => f.name === name);
	const text = fileObj ? await fileObj.text() : null;
	let ret = null;
	try {
		// ret = JSON.parse(text);
		ret = decryptObj(text, sk);
	} catch (e) {
		console.warn('[web3.storage] > file couldnt be decrypted');
	}
	console.log(`[web3.storage] > received:`, ret);
	return ret;
}

async function destroy(cid, name = null) {
	console.log(`[web3.storage] > destroying`, cid, '/', name);
	console.time(`[web3.storage] > quering IPFS > [${cid}]`);
	return await put({
		_destroy_: cid,
	}, safeJoin('destroyer', encrypt(cid, sk)))
}

// async function destroy(cid, name = null) {
	// console.log('destroying...');
	// // console.log(client.endpoint)
	// // `${client.endpoint}`
	// const url = new URL(`user/uploads/${cid}`, client.endpoint);
	// console.log('destroy url...', url);
	// const res = await fetch(url.toString(), {
	// 	method: 'DELETE',
	// 	headers: {
	// 		...Web3Storage.headers(token),
	// 		'Access-Control-Request-Headers': 'Link',
	// 	},
	// });
	// console.log(client);
	// console.log('res', res);
	// if (res.status === 404) {
	// 	return undefined;
	// }
	// if (!res.ok) {
	// 	throw new Error(res.statusText);
	// }
	// return res.json();
// }
// console.log(`[web3.storage] > destroying`, cid, '/', name);
// console.time('[web3.storage] > quering IPFS...');

// await client.delete(cid)
// https://api.web3.storage/user/uploads/bafybeievtn7oflpvb3s7o77lktfheeiyzaxvldiwx5hejttslnaqyq4vtm
// console.log(`[web3.storage] > received:`, ret);
// return ret;

export { list, put, get, destroy };

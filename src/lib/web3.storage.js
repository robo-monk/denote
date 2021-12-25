import { Web3Storage } from 'web3.storage';
import { v4 as uuidv4 } from 'uuid';

const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlGNTA0MmJjNzk4RjQxOEJmNkMwZGNiMEExMjU5Y2FEM0RCOTRENzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDA0NDg4MjM0NjYsIm5hbWUiOiJpcm9uaWMtcGFzc3dvcmQtbWFuYWdlciJ9.P4GyOS9rL29eRYQvmjocO3nZKcm9VKJO5fOPYgMj_mA';

const client = new Web3Storage({ token });

function blobToFile(theBlob, fileName) {
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
}

export async function putObj(obj, name = uuidv4()) {
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
  console.log(`https://ipfs.io/ipfs/${cid}/${name}`)
}

const safeChars = {
	replaceWith: '[$dot$]',
	replacee: '.',
};

export function safeJoin(...params) {
    // console.log("safe join params", params)
	return params
		.map((n) => n.replaceAll(safeChars.replacee, safeChars.replaceWith))
		.join(safeChars.replacee);
}

export function safeSplit(str) {
    // console.log("safe split", str)
	return str.split(safeChars.replacee).map((n) =>
		n.replaceAll(safeChars.replaceWith, safeChars.replacee)
	);
}

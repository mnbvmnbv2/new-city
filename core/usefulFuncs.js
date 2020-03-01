//randInt inclusive 0-2 (0,1,2)
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//fisher-yates shuffle
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

//---------------ON-ALL--------------------------------

function onAll(fun, arg) {
	for (let i = 0; i < mapWidth * mapHeight; i++) {
		findTile(i)[fun](arg);
	}
}

function inverseOnAll(fun, arg) {
	for (let i = mapWidth * mapHeight - 1; i > -1; i--) {
		findTile(i)[fun](arg);
	}
}

//---------------------findtile----------------------------

function findTile(tile) {
	let i = Math.floor(tile / mapWidth);
	let j = tile - mapWidth * i;
	return map[i][j];
}

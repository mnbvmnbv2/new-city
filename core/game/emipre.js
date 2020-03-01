class Emipre {
	constructor(gold) {
		this.gold = gold;
		this.buildings = [];
	}
	toString() {
		return this.gold.toFixed(2);
	}
}

class Province {
	constructor(name, pic) {
		this.name = name;
		this.pic = pic;
	}
}

let player = new Emipre(100);

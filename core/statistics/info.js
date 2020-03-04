class InfoTab {
	constructor(title, p) {
		this.title = title;
		this.p = p;
		this.buttons = [];
	}
	addBtn(name, func) {
		let btn = document.createElement('button');
		btn.innerHTML = name;
		btn.addEventListener('click', func);
		this.buttons.push(btn);
	}
	print(layout) {
		if (layout == 'normal') {
			spantextEl.innerHTML = `${this.title}<br>${this.p}<br>`;
			console.log(this.buttons.length);
			for (let i = 0; i < this.buttons.length; i++) {
				spantextEl.appendChild(this.buttons[i]);
			}
		}
	}
}

const statisticsEl = document.getElementById('statistics');

let home = new InfoTab('Home', 'this is the home screen');
let other = new InfoTab('Other modal', 'here there can be more info');
home.addBtn('to other modal', function() {
	other.print('normal');
});
other.addBtn('back', function() {
	home.print('normal');
});
other.addBtn('make tent', function() {
	player.buildings.push('tent');
});
let tabs = [ home, other ];

function helpness() {
	//helpfulEl.innerHTML = findTile(activeTile).toString();
	statisticsEl.innerHTML = `${player.toString()}`;
}

function openInfo() {
	home.print('normal');
	modal.style.display = 'block';
}

const infoFuncs = {
	height : function() {
		///
	},
	region : function() {
		///
	}
};

let menuActive = false;

function openMenu() {
	if (menuActive == false) {
		menuActive = true;
		modal.style.display = 'block';
		spantextEl.innerHTML = `Menu<br>Pause<br>Settings<br>Resume`;
	} else {
		menuActive = false;
		modal.style.display = 'none';
	}
}

//---------------Tileclick---------------

let activeTile = 0;

function selected(e) {
	console.log(map.findTile(e.target.id));
	activeTile = e.target.id;
	openInfo();
}
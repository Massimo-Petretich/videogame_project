const params = {
	// general
	refreshRate: 60,
	background: "#000000",
	gameCanvases: 5,
	get gameCanvasWidth() {
		return this.gameCanvases * canvas.width;
	},
	textColor: window.getComputedStyle(document.body).color,
	// character
	characterColor: "#FFFFFF",
	characterBorderColor: "#000000",
	characterBorderWidth: 0.001 * Math.min(canvas.height, canvas.width),
	characterBackpackColor: "#888888",
	characterHeight: 0.2 * Math.min(canvas.width, canvas.height),
	get characterWidth() {
		return 0.4 * this.characterHeight;
	},
	// thruster pack
	thrusterPackWidth: 0.06 * Math.min(canvas.height, canvas.width),
	thrusterPacHeight: 0.09 * Math.min(canvas.height, canvas.width),
	// oxygen pack
	oxygenPackYProp: 0.2,
	oxygenPackXProp: 0.5,
	oxygenPackXWidth: 0.03 * Math.min(canvas.height, canvas.width),
	oxygenPackXHeight: 0.06 * Math.min(canvas.height, canvas.width),
	get oxygenPackY() {
		return this.oxygenPackYProp * canvas.height;
	},
	get oxygenPackX() {
		return this.oxygenPackXProp * canvas.width;
	},
	oxygenPackColor: "#FFFFFF",
	oxygenPackBorderColor: "#0000",
	oxygenPackBorderWidth: 0.01 * Math.min(canvas.height, canvas.width),
	// floor
	floorNPieces: 9,
	floorWidthProp: 0.7,
	floorYProp: 0.7,
	floorHeightProp: 0.07,
	floorTopSideColor: "#999999",
	floorFrontSideColor: "#555555",
	floorBorderColor: "#FFFFFF",
	floorBorderWidth: 0.003 * Math.min(canvas.height, canvas.width),
	floorFrontSideHeightProp: 0.8,
	// stars
	get nStars() {
		return 100 * this.gameCanvases;
	},
	starsSize: 0.003 * Math.min(canvas.height, canvas.width),
	starsColor: "#FFFFFF",
	// clouds
	get nClouds() {
		return 3 * this.gameCanvases;
	},
	cloudsSize: 0.05 * Math.min(canvas.height, canvas.width),
	cloudsColor: "#FFFFFF",
	// trees
	get treesHeight() {
		return 0.3 * Math.min(canvas.width, this.floorYProp * canvas.height);
	},
	get treesWidth() {
		return 0.6 * this.treesHeight;
	},
	treesPotColor: "#444444",
	treesStemColor: "#333333",
	treesCanopyColor: "#777777",
	treesBorderColor: "#000000",
	// mountain
	get mountainHeight() {
		return 0.7 * Math.min(canvas.width, this.floorYProp * canvas.height);
	},
	mountainColor: "#999999",
	mountainBorderColor: "#FFFFFF",
	// planet
	planetColor: "#CCCCCC",
	planetSize: 0.05 * Math.min(canvas.height, canvas.width),
	planetBorderColor: "#EEEEEE",
	// movement
	get speedGravity() {
		return 0.04 * this.floorYProp * canvas.height;
	},
	get speedUp() {
		// do not change will affect the geometry of the jump
		return 2 * this.speedGravity;
	},
	get speedDown() {
		return 1 * this.speedGravity;
	},
	speedHorizontal: 0.04 * canvas.width,
	get jumpHeight() {
		const incrementSlack = 1.5;
		const holesXWidthProp = 1 - this.floorWidthProp;
		const holesSize =
			(this.gameCanvasWidth * holesXWidthProp) / this.floorNPieces;
		const resultingSpeedUp = this.speedUp - this.speedGravity;
		const tangent = resultingSpeedUp / this.speedHorizontal;
		const theta = Math.atan(tangent);
		const hypothenuse = (0.5 * holesSize) / Math.cos(theta);
		const height = hypothenuse * Math.sin(theta);
		return incrementSlack * height;
	},
};

let keys = {
	isLeft: false,
	isRight: false,
	isJumping: false,
	isThrusterUp: false,
	isThrusterDown: false,
	isThrusterLeft: false,
	isThrusterRight: false,
	isInfo: false,
	isClearInfo: false
};

let gameSession = {
	gameState: 'running',
	showInfo() {
		this.gameState = 'help'
		const infoString = 'Mission --> collect the Oxygen pack; Keys --> c: clear this message; a: left, d: right; w: jump. Arrows (up/down/left/right) unlocked if thrusters pack is collected.'
		const element = document.getElementById("game-info")
		element.textContent = infoString
	},
	removeInfo() {
		this.gameState = 'running'
		document.getElementById("game-info").textContent = 'h: Help'
	},
	resetKeys() {
		return Object.keys(keys).forEach((key) => (keys[key] = false));
	},
	callGameOver() {
		this.resetKeys();
		this.gameState = 'game over';
		document.getElementById("game-info").textContent = "GAME OVER";
	},
	callMissionAccomplished() {
		this.gameState = 'mission accomplished';
		document.getElementById("game-info").textContent = "MISSION ACCOMPLISHED";
	},
	updateDrawCollectable(collectable, characterAttr) {
		collectable.updatePosition();
		if (character[characterAttr]) return null;
		const dist = character.centerDist(collectable.x, collectable.y);
		const collectableSize = Math.max(collectable.width, collectable.height);
		collectable.draw();
		if (dist > collectableSize) return null;
		const infoStr = collectable.constructor.name + " pack collected";
		character[characterAttr] = true;
		document.getElementById("game-info").textContent = infoStr;
	},
};

let floors = new Floors(
	params.gameCanvasWidth,
	canvas.height,
	params.floorNPieces,
	params.floorWidthProp,
	params.floorYProp,
	params.floorHeightProp,
	params.floorTopSideColor,
	params.floorFrontSideColor,
	params.floorFrontSideHeightProp,
	params.floorBorderColor,
	params.floorBorderWidth
);

const stars = new Stars(
	params.gameCanvasWidth,
	canvas.height,
	params.starsSize,
	params.starsColor,
	params.nStars
);

const clouds = new Clouds(
	params.gameCanvasWidth,
	canvas.height,
	params.cloudsSize,
	params.cloudsColor,
	params.nClouds
);

const character = new Character(
	0.5 * canvas.width - 0.5 * params.characterWidth,
	floors.y - params.characterHeight,
	params.characterWidth,
	params.characterHeight,
	params.characterColor,
	params.characterBorderColor,
	params.characterBorderWidth,
	params.characterBackpackColor
);

thrusterPack = new ThrustersPack(
	floors.floors[params.floorNPieces - 1].x +
		0.25 * floors.floors[params.floorNPieces - 1].width -
		params.thrusterPackWidth * 0.5,
	floors.y - params.thrusterPacHeight,
	params.thrusterPackWidth,
	params.thrusterPacHeight,
	params.characterBackpackColor,
	params.characterBorderColor,
	params.characterBorderWidth
);

const oxygenPack = new OxygenPack(
	params.oxygenPackX,
	params.oxygenPackY,
	params.oxygenPackXWidth,
	params.oxygenPackXHeight,
	params.oxygenPackColor,
	params.oxygenPackBorderColor,
	params.oxygenPackBorderWidth
);

let trees = new Trees(
	params.treesWidth,
	params.treesHeight,
	params.treesPotColor,
	params.treesStemColor,
	params.treesCanopyColor,
	params.treesBorderColor
);

let mountain = new Mountain(
	floors.floors[Math.round(params.floorNPieces / 2)].x +
		0.1 * floors.floors[Math.round(params.floorNPieces / 2)].width,
	floors.y - params.mountainHeight,
	0.8 * floors.floors[Math.round(params.floorNPieces / 2)].width,
	params.mountainHeight,
	params.mountainColor,
	params.mountainBorderColor
);

let planet = new Planet(
	Math.random() * canvas.width,
	Math.random() * params.floorYProp * canvas.height,
	params.planetSize,
	params.planetColor
);

function drawCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = params.background;
	context.fillRect(0, 0, canvas.width, canvas.height);
	stars.updatePosition();
	stars.draw();
	planet.updatePosition();
	planet.draw();
	clouds.updatePosition();
	clouds.draw();
	floors.updatePosition();
	floors.draw();
	trees.updatePosition();
	trees.draw();
	mountain.updatePosition();
	mountain.draw();

	gameSession.updateDrawCollectable(thrusterPack, "hasThrustersPack");
	gameSession.updateDrawCollectable(oxygenPack, "hasOxygenPack");

	character.updatePosition();

	if (keys.isInfo && gameSession.gameState !== 'help') 
		gameSession.showInfo()
	if (keys.isClearInfo && gameSession.gameState === 'help') 
		gameSession.removeInfo()
	
	if (character.isWithinXHoles() && character.isBelowFloor())
		gameSession.callGameOver();
	if (character.hasOxygenPack) 
		gameSession.callMissionAccomplished()

	if (character.touchesCanvasBottom()) {
		character.draw("broken");
		clearInterval(gameSession.intervalId);
	} else if (character.touchesFloor() && keys.isRight) {
		character.draw("walkingRight");
	} else if (character.touchesFloor() && keys.isLeft) {
		character.draw("walkingLeft");
	} else if (
		(character.yOrientation == "up" && keys.isLeft) ||
		(character.hasThrustersPack && keys.isThrusterLeft)
	) {
		character.draw("jumpingLeft");
	} else if (
		(character.yOrientation == "up" && keys.isRight) ||
		(character.hasThrustersPack && keys.isThrusterRight)
	) {
		character.draw("jumpingRight");
	} else if (character.touchesFloor()) {
		character.draw("facingForward");
	} else if (keys.isJumping || keys.isThrusterUp) {
		character.draw("jumpingFacingForward");
	} else {
		character.draw("facingForward");
	}
}

// drawCanvas();
gameSession.intervalId = setInterval(drawCanvas, params.refreshRate);

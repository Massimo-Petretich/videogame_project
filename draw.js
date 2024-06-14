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
	oxygenPacksNpieces: 6,
	oxygenPacksXWidth: 0.03 * Math.min(canvas.height, canvas.width),
	oxygenPacksXHeight: 0.08 * Math.min(canvas.height, canvas.width),
	oxygenPacksColor: "#FFFFFF",
	oxygenPacksBorderColor: "#FFFFFF",
	oxygenPacksBorderWidth: 0 * Math.min(canvas.height, canvas.width),
	oxygenPacksSpeed: 0.001 * Math.min(canvas.height, canvas.width),
	oxygenPacksJittering: 0 * Math.min(canvas.height, canvas.width),
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
	get starsSpeed() {
		return -0.02 * this.speedHorizontal;
	},
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
	get planetSpeed() {
		return 0.05 * this.speedHorizontal;
	},
	// character movement
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
		const incrementSlack = 2;
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
	isClearInfo: false,
};

let gameSession = {
	gameState: "running",
	showInfo() {
		this.gameState = "help";
		const infoString =
			"Mission --> collect the Oxygen pack; Keys --> c: clear this message; a: left, d: right; w: jump. Arrows (up/down/left/right) unlocked if thrusters pack is collected.";
		const element = document.getElementById("game-info");
		element.textContent = infoString;
	},
	removeInfo() {
		this.gameState = "running";
		document.getElementById("game-info").textContent = "h: Help";
	},
	resetKeys() {
		return Object.keys(keys).forEach((key) => (keys[key] = false));
	},
	callGameOver() {
		this.resetKeys();
		this.gameState = "game over";
		document.getElementById("game-info").textContent = this.gameState;
	},
	callMissionAccomplished() {
		this.gameState = "mission accomplished";
		document.getElementById("game-info").textContent = this.gameState;
	},
	updateDrawCollectable(collectable) {
		collectable.updatePosition();
		if (collectable.isFound) return null;
		const dist = character.centerDist(collectable.x, collectable.y);
		const collectableSize = Math.max(collectable.width, collectable.height);
		collectable.draw();
		if (dist > collectableSize) return null;
		collectable.isFound = true;
		// const infoStr = collectable.constructor.name + " pack collected";
		// document.getElementById("game-info").textContent = infoStr;
	},
	restoreCanvas() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = params.background;
		context.fillRect(0, 0, canvas.width, canvas.height);
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
	params.nStars,
	params.starsSpeed
);

const clouds = new Clouds(
	params.gameCanvasWidth,
	canvas.height,
	params.cloudsSize,
	params.cloudsColor,
	params.nClouds
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

const oxygenPacks = new OxygenPacks(
	params.oxygenPacksNpieces,
	params.oxygenPacksXWidth,
	params.oxygenPacksXHeight,
	params.oxygenPacksColor,
	params.oxygenPacksBorderColor,
	params.oxygenPacksBorderWidth,
	params.oxygenPacksJittering,
	params.oxygenPacksSpeed
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
	floors.floors[Math.round(0.5 * params.floorNPieces)].x +
		0.1 * floors.floors[Math.round(0.5 * params.floorNPieces)].width,
	floors.y - params.mountainHeight,
	0.8 * floors.floors[Math.round(0.5 * params.floorNPieces)].width,
	params.mountainHeight,
	params.mountainColor,
	params.mountainBorderColor
);

let planet = new Planet(
	Math.random() * canvas.width,
	Math.random() * params.floorYProp * canvas.height,
	params.planetSize,
	params.planetColor,
	params.planetSpeed
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

function drawCanvas(init) {
	gameSession.restoreCanvas();
	
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

	gameSession.updateDrawCollectable(thrusterPack);
	oxygenPacks.oxygenPacks.map((oxygenPack) =>
		gameSession.updateDrawCollectable(oxygenPack)
	);

	character.updatePosition();

	if (keys.isInfo && gameSession.gameState !== "help") gameSession.showInfo();
	if (keys.isClearInfo && gameSession.gameState === "help")
		gameSession.removeInfo();

	if (character.isWithinXHoles() && character.isBelowFloor())
		gameSession.callGameOver();
	if (character.hasOxygenPack) gameSession.callMissionAccomplished();

	if (character.touchesCanvasBottom()) {
		character.draw("broken");
		clearInterval(gameSession.intervalId);
	} else if (character.touchesFloor() && keys.isRight) {
		character.draw("walkingRight");
	} else if (character.touchesFloor() && keys.isLeft) {
		character.draw("walkingLeft");
	} else if (
		(character.yOrientation == "up" && keys.isLeft) ||
		(thrusterPack.isFound && keys.isThrusterLeft)
	) {
		character.draw("jumpingLeft");
	} else if (
		(character.yOrientation == "up" && keys.isRight) ||
		(thrusterPack.isFound && keys.isThrusterRight)
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

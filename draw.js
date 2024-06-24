window.gameSession = {
	gameState: "running",
	cameraXCoordinate: 0,
	wrapCameraAroundLeftRight() {
		if (this.cameraXCoordinate > 0.5 * window.configs.gameCanvasWidth) {
			this.cameraXCoordinate -= window.configs.gameCanvasWidth;
		} else if (
			this.cameraXCoordinate <
			-0.5 * window.configs.gameCanvasWidth
		) {
			this.cameraXCoordinate += window.configs.gameCanvasWidth;
		}
	},
	updateCameraXcoordinate() {
		if (keys.isLeft)
			this.cameraXCoordinate -= window.configs.speedHorizontal;
		if (keys.isRight)
			this.cameraXCoordinate += window.configs.speedHorizontal;
		if (
			keys.isThrusterRight &&
			window.graphicsElements.collectables.thrusterPack.isFound
		)
			this.cameraXCoordinate += window.configs.speedHorizontal;
		if (
			keys.isThrusterLeft &&
			window.graphicsElements.collectables.thrusterPack.isFound
		)
			this.cameraXCoordinate -= window.configs.speedHorizontal;
		this.wrapCameraAroundLeftRight();
	},
	showHelp() {
		this.gameState = "help";
		const element = document.getElementById("help-info");
		const helpText = element.getAttribute("data-helpText");
		const lines = helpText.split("<br>");
		element.textContent = "";
		lines.forEach((line, idx) => {
			if (idx > 0) element.appendChild(document.createElement("br"));
			element.appendChild(document.createTextNode(line));
		});
	},
	removeHelp() {
		this.gameState = "running";
		const element = document.getElementById("help-info");
		const helpKeyText = element.getAttribute("data-helpKeyText");
		document.getElementById("help-info").textContent = helpKeyText;
	},
	resetKeys() {
		return Object.keys(keys).forEach((key) => (keys[key] = false));
	},
	callGameOver() {
		this.resetKeys();
		this.gameState = "game over";
		document.getElementById("game-info").textContent = this.gameState;
	},
	callGameEnded() {
		this.gameState = "game ended";
		document.getElementById("game-info").textContent = this.gameState;
		window.graphicsElements.character.draw("broken");
		clearInterval(this.intervalId);
	},
	callMissionAccomplished() {
		this.resetKeys();
		this.gameState = "mission accomplished";
		document.getElementById("game-info").textContent = this.gameState;
	},
	updateDrawCollectable(collectable) {
		collectable.updatePosition();
		if (collectable.isFound) return null;
		const dist = window.graphicsElements.character.centerDist(
			collectable.xCamera,
			collectable.y
		);
		const collectableSize = Math.max(collectable.width, collectable.height);
		collectable.draw();
		if (dist > collectableSize) return null;
		collectable.isFound = true;
	},
	updateCollectedCount() {
		const infoStr =
			"Collected items: " +
			window.graphicsElements.collectables.oxygenPacks.foundCount +
			"  of " +
			window.graphicsElements.collectables.oxygenPacks.oxygenPacks.length;
		const element = document.getElementById("collectable-info");
		element.textContent = infoStr;
	},
	restoreCanvas() {
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		context.fillStyle = window.configs.background;
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	},
};

function drawCanvas() {
	window.gameSession.restoreCanvas();
	window.gameSession.updateCameraXcoordinate();
	// background graphic objects
	for (let key in window.graphicsElements.background) {
		let element = window.graphicsElements.background[key];
		element.updatePosition();
		element.draw();
	}

	// collectables
	window.gameSession.updateDrawCollectable(
		window.graphicsElements.collectables.thrusterPack
	);
	window.graphicsElements.character.hasThrusterPack =
		window.graphicsElements.collectables.thrusterPack.isFound;

	window.graphicsElements.collectables.oxygenPacks.oxygenPacks.map(
		window.gameSession.updateDrawCollectable
	);

	if (window.gameSession.gameState === "running")
		window.gameSession.updateCollectedCount();

	// game states
	if (keys.isInfo && window.gameSession.gameState !== "help")
		window.gameSession.showHelp();
	if (keys.isClearInfo && window.gameSession.gameState === "help")
		window.gameSession.removeHelp();

	if (
		window.graphicsElements.collectables.oxygenPacks.foundCount ===
		window.configs.oxygenPacksNpieces
	)
		window.gameSession.callMissionAccomplished();

	if (window.graphicsElements.character.touchesCanvasBottom()) {
		window.gameSession.callGameEnded();
		return null;
	}
	if (
		window.graphicsElements.character.isWithinXHoles(
			window.graphicsElements.background.holes.holes
		) &&
		window.graphicsElements.character.isBelowFloor()
	)
		window.gameSession.callGameOver();

	// character
	window.graphicsElements.character.updatePosition(
		window.graphicsElements.background.holes.holes
	);

	if (window.graphicsElements.character.touchesFloor()) {
		if (keys.isRight) {
			window.graphicsElements.character.draw("walkingRight");
		} else if (keys.isLeft) {
			window.graphicsElements.character.draw("walkingLeft");
		} else if (
			window.graphicsElements.collectables.thrusterPack.isFound &&
			keys.isThrusterLeft
		) {
			window.graphicsElements.character.draw("jumpingLeft");
		} else if (
			window.graphicsElements.collectables.thrusterPack.isFound &&
			keys.isThrusterRight
		) {
			window.graphicsElements.character.draw("jumpingRight");
		} else {
			window.graphicsElements.character.draw("facingForward");
		}
	} else {
		if (
			keys.isLeft ||
			(window.graphicsElements.collectables.thrusterPack.isFound &&
				keys.isThrusterLeft)
		) {
			window.graphicsElements.character.draw("jumpingLeft");
		} else if (
			keys.isRight ||
			(window.graphicsElements.collectables.thrusterPack.isFound &&
				keys.isThrusterRight)
		) {
			window.graphicsElements.character.draw("jumpingRight");
		} else if (keys.isJumping || keys.isThrusterUp) {
			window.graphicsElements.character.draw("jumpingFacingForward");
		} else {
			window.graphicsElements.character.draw("facingForward");
		}
	}
}

window.gameSession.intervalId = setInterval(
	drawCanvas,
	window.configs.refreshRate
);

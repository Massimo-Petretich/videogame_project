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
		if (window.keys.isLeft)
			this.cameraXCoordinate -= window.configs.speedHorizontal;
		if (window.keys.isRight)
			this.cameraXCoordinate += window.configs.speedHorizontal;
		if (
			window.keys.isThrusterRight &&
			window.graphicsElements.collectables.thrusterPack.isFound
		)
			this.cameraXCoordinate += window.configs.speedHorizontal;
		if (
			window.keys.isThrusterLeft &&
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
		return Object.keys(window.keys).forEach((key) => (window.keys[key] = false));
	},
	callGameState(state) {
		this.resetKeys();
		this.gameState = state;
		document.getElementById("game-info").textContent = state;
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
	displayOxygenPacksCollectedCount() {
		const infoStr =
			"Collected items: " +
			window.graphicsElements.collectables.oxygenPacks.foundCount +
			"  of " +
			window.configs.oxygenPacksNpieces;
		document.getElementById("collectable-info").textContent = infoStr;
	},
	displayLivesCount() {
		const infoStr = "Lives: " + window.graphicsElements.character.lives;
		document.getElementById("lives-info").textContent = infoStr;
	},
	updateFlagReached() {
		const flagX = window.graphicsElements.background.flag.xCamera;
		const dist = window.graphicsElements.character.xDist(flagX);
		if (dist < 0.5 * window.graphicsElements.character.width) {
			window.graphicsElements.background.flag.isReached = true;
		} else {
			window.graphicsElements.background.flag.isReached = false;
		}
	},
	restoreCanvas() {
		const context = document.getElementById("canvas2D").getContext("2d");
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		context.fillStyle = window.configs.background;
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	},
	dealWithInterval() {
		switch (this.gameState) {
			case "game over":
				clearInterval(this.intervalId);
				break;
			case "level completed":
				clearInterval(this.intervalId);
				break;
		}
	}
};



function drawCanvas() {
	// general
	window.gameSession.restoreCanvas();
	window.gameSession.updateCameraXcoordinate();
	window.gameSession.updateFlagReached();
	window.gameSession.displayLivesCount();

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
	window.gameSession.displayOxygenPacksCollectedCount();

	// game states
	if (window.keys.isInfo && window.gameSession.gameState !== "help")
		window.gameSession.showHelp();
	if (window.keys.isClearInfo && window.gameSession.gameState === "help")
		window.gameSession.removeHelp();

	if (
		window.graphicsElements.collectables.oxygenPacks.foundCount ===
			window.configs.oxygenPacksNpieces &&
		window.graphicsElements.background.flag.isReached
	)
		window.gameSession.callGameState('tasks accomplished');
	
	if (
		window.gameSession.gameState === "tasks accomplished" &&
		window.graphicsElements.character.touchesFloor()
	)
		window.gameSession.callGameState('level completed');

	if (
		window.graphicsElements.character.lives === 0 &&
		window.graphicsElements.character.isPlummeting
	)
		window.gameSession.callGameState('locked');
	if (
		window.graphicsElements.character.lives === 0 && 
		window.gameSession.gameState === "locked" &&
		window.graphicsElements.character.isbelowCanvasBottom()
	)
		window.gameSession.callGameState('game over');
	
	

	// character
	window.graphicsElements.character.updatePosition(
		window.graphicsElements.background.holes.holes, 
		window.keys
	);

	if (window.gameSession.gameState === "game over") {
		window.graphicsElements.character.stopOnCanvasBottom()
		window.graphicsElements.character.draw("broken");
	} else if (window.graphicsElements.character.touchesFloor()) {
		if (window.keys.isRight) {
			window.graphicsElements.character.draw("walkingRight");
		} else if (window.keys.isLeft) {
			window.graphicsElements.character.draw("walkingLeft");
		} else if (
			window.graphicsElements.collectables.thrusterPack.isFound &&
			window.keys.isThrusterLeft
		) {
			window.graphicsElements.character.draw("jumpingLeft");
		} else if (
			window.graphicsElements.collectables.thrusterPack.isFound &&
			window.keys.isThrusterRight
		) {
			window.graphicsElements.character.draw("jumpingRight");
		} else {
			window.graphicsElements.character.draw("facingForward");
		}
	} else {
		if (
			window.keys.isLeft ||
			(window.graphicsElements.collectables.thrusterPack.isFound &&
				window.keys.isThrusterLeft)
		) {
			window.graphicsElements.character.draw("jumpingLeft");
		} else if (
			window.keys.isRight ||
			(window.graphicsElements.collectables.thrusterPack.isFound &&
				window.keys.isThrusterRight)
		) {
			window.graphicsElements.character.draw("jumpingRight");
		} else if (window.keys.isJumping || window.keys.isThrusterUp) {
			window.graphicsElements.character.draw("jumpingFacingForward");
		} else {
			window.graphicsElements.character.draw("facingForward");
		}
	}
	window.gameSession.dealWithInterval()
}

window.gameSession.intervalId = setInterval(
	drawCanvas,
	window.configs.refreshRate
);

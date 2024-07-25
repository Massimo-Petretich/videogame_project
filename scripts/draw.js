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
	decrementOxygenLevel(amount) {
		window.graphicsElements.character.oxygenLevel -= amount;
		if (window.graphicsElements.character.oxygenLevel > 100)
			window.graphicsElements.character.oxygenLevel = 100;
	},
	decrementThrusterPackFill() {
		window.graphicsElements.collectables.thrusterPack.fillLevel -=
			window.configs.thrusterPackFillDecrement;
		if (window.graphicsElements.collectables.thrusterPack.fillLevel <= 0) {
			window.graphicsElements.collectables.thrusterPack.isExhausted = true;
			window.graphicsElements.collectables.thrusterPack.isFound = false;
		}
	},
	displayThrustePackFill() {
		const infoStr =
			"Thruster pack fill level: " +
			window.graphicsElements.collectables.thrusterPack.fillLevel +
			"  %";
		document.getElementById("thrusterPack-info").textContent = infoStr;
	},
	updateCameraXcoordinate() {
		if (window.keys.isLeft) {
			this.cameraXCoordinate -= window.configs.speedHorizontal;
			this.decrementOxygenLevel(
				window.configs.characterOxygenLevelDecrementWalk
			);
		}
		if (window.keys.isRight) {
			this.cameraXCoordinate += window.configs.speedHorizontal;
			this.decrementOxygenLevel(
				window.configs.characterOxygenLevelDecrementWalk
			);
		}
		if (
			window.keys.isThrusterRight &&
			window.graphicsElements.collectables.thrusterPack.isFound
		) {
			this.cameraXCoordinate += window.configs.speedHorizontal;
			this.decrementThrusterPackFill();
		}
		if (
			window.keys.isThrusterLeft &&
			window.graphicsElements.collectables.thrusterPack.isFound
		) {
			this.cameraXCoordinate -= window.configs.speedHorizontal;
			this.decrementThrusterPackFill();
		}
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
		return Object.keys(window.keys).forEach(
			(key) => (window.keys[key] = false)
		);
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
		window.gameSession.decrementOxygenLevel(
			-400 * window.configs.characterOxygenLevelDecrement
		);
		playSound("collect");
	},
	getEnemyDist(enemy) {
		return window.graphicsElements.character.xDist(enemy.xCamera);
	},
	distEnemyOverlaps(dist) {
		const threshold =
			0.5 * window.graphicsElements.character.width +
			window.graphicsElements.background.enemies.radius;
		return dist < threshold;
	},
	dealWithEnemies() {
		const feetHeight =
			window.graphicsElements.character.y +
			window.graphicsElements.character.height;
		const isAboveEnemies =
			feetHeight <
			window.graphicsElements.background.floors.y -
				2 * window.graphicsElements.background.enemies.radius;
		if (isAboveEnemies) return null;
		const touchesEnemy = window.graphicsElements.background.enemies.enemies
			.map(this.getEnemyDist)
			.some(this.distEnemyOverlaps);
		if (touchesEnemy) window.graphicsElements.character.callNewLife();
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
	displayOxygenLevel() {
		const infoStr =
			"Character oxygen level: " +
			Math.round(window.graphicsElements.character.oxygenLevel) +
			"  %";
		document.getElementById("characterOxygen-info").textContent = infoStr;
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
	},
};

function drawCanvas() {
	// general
	window.gameSession.restoreCanvas();
	window.gameSession.updateCameraXcoordinate();
	window.gameSession.updateFlagReached();
	window.gameSession.displayLivesCount();
	window.gameSession.displayThrustePackFill();
	window.gameSession.displayOxygenLevel();
	window.gameSession.decrementOxygenLevel(
		//default oxygen consumption
		window.configs.characterOxygenLevelDecrement
	);

	// background graphic objects
	for (let key in window.graphicsElements.background) {
		let element = window.graphicsElements.background[key];
		element.updatePosition();
		element.draw();
	}

	// enemies
	window.gameSession.dealWithEnemies();

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
		window.gameSession.callGameState("tasks accomplished");

	if (
		window.gameSession.gameState === "tasks accomplished" &&
		window.graphicsElements.character.touchesFloor
	)
		window.gameSession.callGameState("level completed");

	if (window.graphicsElements.character.isPlummeting)
		window.gameSession.callGameState("locked");
	if (
		window.graphicsElements.character.lives === 0 &&
		window.gameSession.gameState === "locked" &&
		window.graphicsElements.character.isbelowCanvasBottom
	)
		window.gameSession.callGameState("game over");

	if (window.graphicsElements.character.lives < 0)
		window.gameSession.callGameState("game over");

	if (window.graphicsElements.character.oxygenLevel < 0)
		window.gameSession.callGameState("game over");

	if (
		window.gameSession.gameState === "level completed" ||
		window.gameSession.gameState === "game over"
	)
		playSound(window.gameSession.gameState);

	// character
	window.graphicsElements.character.updatePosition(
		window.graphicsElements.background.holes.holes,
		window.graphicsElements.background.platforms.floors,
		window.keys
	);

	if (window.gameSession.gameState === "game over") {
		window.graphicsElements.character.stopOnCanvasBottom();
		window.graphicsElements.character.draw("broken");
	} else if (
		window.graphicsElements.character.touchesFloor ||
		window.graphicsElements.character.touchesPlatform
	) {
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
	window.gameSession.dealWithInterval();
}

window.gameSession.intervalId = setInterval(
	drawCanvas,
	window.configs.refreshRate
);

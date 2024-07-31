window.gameSession = {
	gameState: "running",
	cameraXCoordinate: 0,
	lives: window.configs.lives,

	resetKeys() {
		return Object.keys(window.keys).forEach(
			(key) => (window.keys[key] = false)
		);
	},
	callGameState(state) {
		this.resetKeys();
		this.gameState = state;
		this.displayGameState();
	},
	callNewLife() {
		this.cameraXCoordinate = 0;
		window.graphicsElements.character.y =
			window.configs.floorsY -
			2 * window.graphicsElements.character.height;
		this.lives -= 1;
		window.graphicsElements.character.isPlummeting = false;
		this.callGameState("running");
		this.playSound("lost life");
	},
	restoreCanvas() {
		const context = document.getElementById("canvas2D").getContext("2d");
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		context.fillStyle = window.configs.background;
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	},
	dealWithInterval() {
		switch (this.gameState) {
			case "GAME OVER":
				clearInterval(this.intervalId);
				break;
			case "LEVEL COMPLETED":
				clearInterval(this.intervalId);
				break;
		}
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
	playSound(sound) {
		let audio;
		switch (sound) {
			case "jump":
				audio = new Audio("sounds/laser.wav");
				audio.volume = 0.3;
				break;
			case "jumpLand":
				audio = new Audio("sounds/jump_land.mp3");
				break;
			case "collect":
				audio = new Audio("sounds/collected.mp3");
				break;
			case "GAME OVER":
				audio = new Audio("sounds/game_over.mp3");
				break;
			case "LEVEL COMPLETED":
				audio = new Audio("sounds/level_completed.wav");
				break;
			case "lost life":
				audio = new Audio("sounds/lost_life.wav");
				audio.volume = 0.3;
				break;
		}
		audio.play();
	},

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
		this.decrementOxygenLevel(
			-400 * window.configs.characterOxygenLevelDecrement
		);
		this.playSound("collect");
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
		if (touchesEnemy) this.callNewLife();
	},

	displayOxygenPacksCollectedCount() {
		const infoStr =
			"Collected items: " +
			window.graphicsElements.collectables.oxygenPacks.foundCount +
			"  of " +
			window.configs.oxygenPacksNpieces;
		document.getElementById("collectable-info").textContent = infoStr;
	},
	displayGameState() {
		const infoStr = "Game state: " + this.gameState;
		document.getElementById("game-info").textContent = infoStr;
	},
	displayLivesCount() {
		const infoStr = "Lives: " + this.lives;
		document.getElementById("lives-info").textContent = infoStr;
	},
	displayOxygenLevel() {
		let oxygenLevel = window.graphicsElements.character.oxygenLevel;
		let infoStr =
			"Character oxygen level: " + Math.round(oxygenLevel) + "  %";
		if (oxygenLevel <= 0) {
			oxygenLevel = 0;
			infoStr += " --> RUN OUT OF OXYGEN";
		}
		document.getElementById("characterOxygen-info").textContent = infoStr;
	},
	displayThrustePackFill() {
		const infoStr =
			"Thruster pack fill level: " +
			window.graphicsElements.collectables.thrusterPack.fillLevel +
			"  %";
		document.getElementById("thrusterPack-info").textContent = infoStr;
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
};

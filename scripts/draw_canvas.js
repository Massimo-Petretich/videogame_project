function updateGameFrame() {
	// general
	window.gameSession.restoreCanvas();
	window.gameSession.updateCameraXcoordinate();
	window.gameSession.updateFlagReached();
	window.gameSession.displayLivesCount();
	window.gameSession.displayThrustePackFill();
	window.gameSession.decrementOxygenLevel(
		//default oxygen consumption
		window.configs.characterOxygenLevelDecrement
	);
	window.gameSession.displayOxygenLevel();

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
		window.gameSession.updateDrawCollectable.bind(window.gameSession)
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
		window.gameSession.callGameState("LEVEL COMPLETED");

	if (window.graphicsElements.character.isPlummeting)
		window.gameSession.callGameState("locked");
	if (
		window.gameSession.lives === 0 &&
		window.gameSession.gameState === "locked" &&
		window.graphicsElements.character.isbelowCanvasBottom
	)
		window.gameSession.callGameState("GAME OVER");

	if (window.gameSession.lives < 0)
		window.gameSession.callGameState("GAME OVER");

	if (window.graphicsElements.character.oxygenLevel < 0)
		window.gameSession.callGameState("GAME OVER");

	if (
		window.gameSession.gameState === "LEVEL COMPLETED" ||
		window.gameSession.gameState === "GAME OVER"
	)
		window.gameSession.playSound(window.gameSession.gameState);

	if (window.graphicsElements.character.y >= window.innerHeight)
		window.gameSession.callNewLife();

	// character
	window.graphicsElements.character.updatePosition(
		window.graphicsElements.background.holes.holes,
		window.graphicsElements.background.platforms.floors,
		window.keys
	);

	if (window.gameSession.gameState === "GAME OVER") {
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
	updateGameFrame,
	window.configs.refreshRate
);

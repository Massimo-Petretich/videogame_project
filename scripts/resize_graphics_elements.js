function resizeGraphicsElements() {
	const thrusterPackIsFound =
		window.graphicsElements.collectables.thrusterPack.isFound;
	const oxygenPacksFoundCount =
		window.graphicsElements.collectables.oxygenPacks.foundCount;
	const cameraXprop =
		window.gameSession.cameraXCoordinate / window.configs.gameCanvasWidth;

	initializeConfigs()
	initializeGraphicsElements();

	window.graphicsElements.collectables.thrusterPack.isFound =
		thrusterPackIsFound;
	window.graphicsElements.collectables.oxygenPacks.foundCount =
		oxygenPacksFoundCount;
	window.gameSession.cameraXCoordinate =
		cameraXprop * window.configs.gameCanvasWidth;
}

window.addEventListener("resize", resizeGraphicsElements);

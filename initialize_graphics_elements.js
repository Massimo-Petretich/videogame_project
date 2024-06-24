function initializeGraphicsElements() {
	window.graphicsElements = {};
	window.graphicsElements.background = {};

	window.graphicsElements.background.stars = new Stars(
		window.configs.starsParams,
		window.configs.starsColor,
		window.configs.starsSpeed,
		window.context
	);
	window.graphicsElements.background.planet = new Planet(
		window.configs.planetX,
		window.configs.planetY,
		window.configs.planetSize,
		window.configs.planetColor,
		window.configs.planetSpeed,
		window.context
	);

	window.graphicsElements.background.floors = new Floors(
		window.configs.floorsXCoordinates,
		window.configs.floorsY,
		window.configs.floorsHeight,
		window.configs.floorsTopSideColor,
		window.configs.floorsFrontSideColor,
		window.context,
		window.configs.floorsFrontSideHeightProp,
		window.configs.floorsBorderColor,
		window.configs.floorsBorderWidth
	);
	window.graphicsElements.background.trees = new Trees(
		window.configs.treesX,
		window.configs.treesWidth,
		window.configs.treesHeight,
		window.configs.treesPotColor,
		window.configs.treesStemColor,
		window.configs.treesCanopyColor,
		window.configs.treesBorderColor,
		window.context
	);
	window.graphicsElements.background.mountain = new Mountain(
		window.configs.mountainXCoordinates.start,
		window.configs.mountainY,
		window.configs.mountainXCoordinates.end -
			window.configs.mountainXCoordinates.start,
		window.configs.mountainHeight,
		window.configs.mountainColor,
		window.configs.mountainBorderColor,
		window.context
	);
	window.graphicsElements.background.clouds = new Clouds(
		window.configs.cloudsParams,
		window.configs.cloudsColor,
		window.context
	);

	window.graphicsElements.background.holes = new Holes(
		window.configs.holesXCoordinates
	);

	window.graphicsElements.collectables = {};
	window.graphicsElements.collectables.thrusterPack = new ThrustersPack(
		window.configs.thrusterPackX,
		window.configs.thrusterPackY,
		window.configs.thrusterPackWidth,
		window.configs.thrusterPacHeight,
		window.configs.characterBackpackColor,
		window.configs.characterBorderColor,
		window.configs.characterBorderWidth,
		window.context
	);

	window.graphicsElements.collectables.oxygenPacks = new OxygenPacks(
		window.configs.oxygenPacksParams,
		window.configs.oxygenPacksXWidth,
		window.configs.oxygenPacksXHeight,
		window.configs.oxygenPacksColor,
		window.configs.textColor,
		window.configs.oxygenPacksBorderColor,
		window.context,
		window.configs.oxygenPacksBorderWidth,
		window.configs.oxygenPacksJittering
	);

	window.graphicsElements.character = new Character(
		window.configs.characterX,
		window.configs.characterY,
		window.configs.characterWidth,
		window.configs.characterHeight,
		window.configs.characterColor,
		window.context,
		window.configs.characterBorderColor,
		window.configs.characterBorderWidth,
		window.configs.characterBackpackColor
	);
}

initializeGraphicsElements();

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

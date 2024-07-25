function initializeGraphicsElements() {
	const context = document.getElementById("canvas2D").getContext("2d");

	window.graphicsElements = {};
	window.graphicsElements.background = {};

	window.graphicsElements.background.stars = new Stars(
		window.configs.starsParams,
		window.configs.starsColor,
		window.configs.starsSpeed,
		context
	);
	window.graphicsElements.background.planet = new Planet(
		window.configs.planetX,
		window.configs.planetY,
		window.configs.planetSize,
		window.configs.planetColor,
		window.configs.planetSpeed,
		context
	);

	window.graphicsElements.background.floors = new Floors(
		window.configs.floorsXCoordinates,
		window.configs.floorsY,
		window.configs.floorsHeight,
		window.configs.floorsTopSideColor,
		window.configs.floorsFrontSideColor,
		context,
		window.configs.floorsFrontSideHeightProp,
		window.configs.floorsBorderColor,
		window.configs.floorsBorderWidth
	);
	window.graphicsElements.background.platforms = new Floors(
		window.configs.platformsXCoordinates,
		window.configs.platformsY,
		window.configs.floorsHeight, // same as floors
		window.configs.floorsTopSideColor, // same as floors
		window.configs.floorsFrontSideColor, // same as floors
		context,
		window.configs.floorsFrontSideHeightProp, // same as floors
		window.configs.floorsBorderColor, // same as floors
		window.configs.floorsBorderWidth // same as floors
	);

	window.graphicsElements.background.trees = new Trees(
		window.configs.treesX,
		window.configs.treesWidth,
		window.configs.treesHeight,
		window.configs.treesPotColor,
		window.configs.treesStemColor,
		window.configs.treesCanopyColor,
		window.configs.treesBorderColor,
		context
	);
	window.graphicsElements.background.mountain = new Mountain(
		window.configs.mountainXCoordinates.start,
		window.configs.mountainY,
		window.configs.mountainXCoordinates.end -
			window.configs.mountainXCoordinates.start,
		window.configs.mountainHeight,
		window.configs.mountainColor,
		window.configs.mountainBorderColor,
		context
	);
	window.graphicsElements.background.clouds = new Clouds(
		window.configs.cloudsParams,
		window.configs.cloudsColor,
		context
	);
	window.graphicsElements.background.flag = new Flag(
		window.configs.flagX,
		window.configs.flagPoleHeight,
		window.configs.flagPoleWidth,
		window.configs.flagWidth,
		window.configs.flagHeight,
		window.configs.flagPoleColor,
		window.configs.flagColor,
		context
	);

	window.graphicsElements.background.holes = new Holes(
		window.configs.holesXCoordinates
	);

	window.graphicsElements.background.enemies = new Enemies(
		window.configs.enemiesParams, 
		window.configs.enemiesColor, 
		window.configs.enemiesRadius, 
		context
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
		context
	);

	window.graphicsElements.collectables.oxygenPacks = new OxygenPacks(
		window.configs.oxygenPacksParams,
		window.configs.oxygenPacksXWidth,
		window.configs.oxygenPacksXHeight,
		window.configs.oxygenPacksColor,
		window.configs.textColor,
		window.configs.oxygenPacksBorderColor,
		context,
		window.configs.oxygenPacksBorderWidth,
		window.configs.oxygenPacksJittering
	);

	window.graphicsElements.character = new Character(
		window.configs.characterX,
		window.configs.characterY,
		window.configs.characterWidth,
		window.configs.characterHeight,
		window.configs.characterColor,
		context,
		window.configs.characterBorderColor,
		window.configs.characterBorderWidth,
		window.configs.characterBackpackColor
	);
}

initializeGraphicsElements();

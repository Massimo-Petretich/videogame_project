function initializeConfigs() {
	window.configs = {
		// general
		refreshRate: 60,
		background: "#000000",
		gameCanvases: 5,
		get gameCanvasWidth() {
			return this.gameCanvases * window.innerWidth;
		},
		textColor: "red",
		// character
		characterLives: 2,
		characterColor: "#FFFFFF",
		characterBorderColor: "#000000",
		characterBorderWidth:
			0.001 * Math.min(window.innerHeight, window.innerWidth),
		characterBackpackColor: "#888888",
		characterHeight: 0.2 * Math.min(window.innerWidth, window.innerHeight),
		get characterWidth() {
			return 0.4 * this.characterHeight;
		},
		get characterX() {
			return 0.5 * window.innerWidth - 0.5 * this.characterWidth;
		},
		get characterY() {
			return this.floorsY - this.characterHeight;
		},
		// thruster pack
		thrusterPackWidth:
			0.06 * Math.min(window.innerHeight, window.innerWidth),
		thrusterPacHeight:
			0.09 * Math.min(window.innerHeight, window.innerWidth),
		get thrusterPackX() {
			const floorsXCoordinates = this.floorsXCoordinates;
			const floorXCoordinates =
				floorsXCoordinates[this.floorsNPieces - 1];
			const width = floorXCoordinates.end - floorXCoordinates.start;
			const x =
				floorXCoordinates.start +
				0.25 * width -
				0.5 * this.thrusterPackWidth;
			return x;
		},
		get thrusterPackY() {
			return this.floorsY - this.thrusterPacHeight;
		},
		// oxygen pack
		oxygenPacksNpieces: 2,
		oxygenPacksXWidth:
			0.03 * Math.min(window.innerHeight, window.innerWidth),
		oxygenPacksXHeight:
			0.08 * Math.min(window.innerHeight, window.innerWidth),
		oxygenPacksColor: "#FFFFFF",
		oxygenPacksBorderColor: "#FFFFFF",
		oxygenPacksBorderWidth:
			0 * Math.min(window.innerHeight, window.innerWidth),
		oxygenPacksSpeed:
			0.002 * Math.min(window.innerHeight, window.innerWidth),
		oxygenPacksJittering:
			0 * Math.min(window.innerHeight, window.innerWidth),
		generateOxygenPackParams() {
			const oxygenPacksParam = this.generateRandomXY();
			const speedXcoef = Math.sign(Math.random() - 0.5);
			const speedYcoef = Math.sign(Math.random() - 0.5);
			oxygenPacksParam.speedX = this.oxygenPacksSpeed * speedXcoef;
			oxygenPacksParam.speedY = this.oxygenPacksSpeed * speedYcoef;
			return oxygenPacksParam;
		},
		get oxygenPacksParams() {
			return Array(this.oxygenPacksNpieces)
				.fill(0)
				.map(this.generateOxygenPackParams.bind(this));
		},
		// floor
		floorsNPieces: 9,
		floorsWidthProp: 0.7,
		floorsYProp: 0.7,
		floorsHeightProp: 0.07,
		floorsFrontSideHeightProp: 0.8,
		floorsTopSideColor: "#999999",
		floorsFrontSideColor: "#555555",
		floorsBorderColor: "#FFFFFF",
		floorsBorderWidth:
			0.003 * Math.min(window.innerHeight, window.innerWidth),
		get floorsY() {
			return this.floorsYProp * window.innerHeight;
		},
		get holesWidthProp() {
			return 1 - this.floorsWidthProp;
		},
		get holesSize() {
			return (
				(this.gameCanvasWidth * this.holesWidthProp) /
				this.floorsNPieces
			);
		},
		get floorsSize() {
			return this.gameCanvasWidth / this.floorsNPieces;
		},
		get floorsHeight() {
			return window.innerHeight * this.floorsHeightProp;
		},
		generateFloorPieceCoordinate(_, idx) {
			const coordinates = {};
			coordinates.start =
				idx * this.floorsSize +
				0.5 * this.holesSize -
				0.5 * this.gameCanvasWidth;
			coordinates.end =
				(idx + 1) * this.floorsSize -
				0.5 * this.holesSize -
				0.5 * this.gameCanvasWidth;
			return coordinates;
		},
		get floorsXCoordinates() {
			const xCoordinates = Array(this.floorsNPieces)
				.fill(0)
				.map(this.generateFloorPieceCoordinate.bind(this));
			return xCoordinates;
		},
		generateHoleXCoordinates(_, idx) {
			const coordinates = {};
			coordinates.start =
				idx * this.floorsSize -
				0.5 * this.holesSize -
				0.5 * this.gameCanvasWidth;
			coordinates.end =
				idx * this.floorsSize +
				0.5 * this.holesSize -
				0.5 * this.gameCanvasWidth;
			return coordinates;
		},
		get holesXCoordinates() {
			const xCoordinates = Array(this.floorsNPieces + 1)
				.fill(0)
				.map(this.generateHoleXCoordinates.bind(this));
			return xCoordinates;
		},
		// stars
		get nStars() {
			return 100 * this.gameCanvases;
		},
		starsSize: 0.003 * Math.min(window.innerHeight, window.innerWidth),
		starsColor: "#FFFFFF",
		get starsSpeed() {
			return -0.02 * this.speedHorizontal;
		},
		generateRandomXY() {
			return {
				x:
					Math.random() * this.gameCanvasWidth -
					0.5 * this.gameCanvasWidth,
				y: Math.random() * window.innerHeight,
			};
		},
		generateStarParams() {
			const starParam = this.generateRandomXY();
			starParam.radius = Math.random() * this.starsSize;
			return starParam;
		},
		get starsParams() {
			return Array(this.nStars)
				.fill(0)
				.map(this.generateStarParams.bind(this));
		},
		// clouds
		get nClouds() {
			return 3 * this.gameCanvases;
		},
		cloudsSize: 0.05 * Math.min(window.innerHeight, window.innerWidth),
		cloudsColor: "#FFFFFF",
		generateCloudParams() {
			const cloudParam = this.generateRandomXY();
			cloudParam.size = Math.random() * this.cloudsSize;
			return cloudParam;
		},
		get cloudsParams() {
			return Array(this.nClouds)
				.fill(0)
				.map(this.generateCloudParams.bind(this));
		},
		// trees
		get treesHeight() {
			return 0.3 * Math.min(window.innerWidth, this.floorsY);
		},
		get treesWidth() {
			return 0.6 * this.treesHeight;
		},
		treesPotColor: "#444444",
		treesStemColor: "#333333",
		treesCanopyColor: "#777777",
		treesBorderColor: "#000000",
		generateTreeX(coordinates) {
			const width = coordinates.end - coordinates.start;
			const x = coordinates.start + 0.5 * width - 0.5 * this.treesWidth;
			return x;
		},
		get treesX() {
			const unwantedFloorIdxs = [
				this.mountainFloorIdx,
				this.flagFloorIdx,
			];
			const floorsXCoordinates = this.floorsXCoordinates;
			return floorsXCoordinates
				.filter((_, idx) => !unwantedFloorIdxs.includes(idx))
				.map(this.generateTreeX.bind(this));
		},
		// mountain
		get mountainHeight() {
			return 0.7 * Math.min(window.innerWidth, this.floorsY);
		},
		mountainColor: "#999999",
		mountainBorderColor: "#FFFFFF",
		get mountainFloorIdx() {
			return Math.round(0.5 * this.floorsNPieces);
		},
		get mountainXCoordinates() {
			const floorIdx = this.mountainFloorIdx;
			const floorsXCoordinates = this.floorsXCoordinates;
			const floorXCoordinates = floorsXCoordinates[floorIdx];
			const width = floorXCoordinates.end - floorXCoordinates.start;
			const coordinates = {
				start: floorXCoordinates.start + 0.1 * width,
				end: floorXCoordinates.end - 0.1 * width,
			};
			return coordinates;
		},
		get mountainY() {
			return this.floorsY - this.mountainHeight;
		},
		// planet
		planetColor: "#CCCCCC",
		planetSize: 0.05 * Math.min(window.innerHeight, window.innerWidth),
		planetBorderColor: "#EEEEEE",
		get planetSpeed() {
			return 0.05 * this.speedHorizontal;
		},
		get planetX() {
			return Math.random() * window.innerWidth;
		},
		get planetY() {
			return Math.random() * this.floorsYProp * window.innerHeight;
		},
		// character movement
		get speedGravity() {
			return 0.03 * this.floorsYProp * window.innerHeight;
		},
		get speedUp() {
			// do not change will affect the geometry of the jump
			return 2 * this.speedGravity;
		},
		get speedDown() {
			return 1 * this.speedGravity;
		},
		speedHorizontal: 0.03 * window.innerWidth,
		get jumpHeight() {
			const incrementSlack = 2;
			const resultingSpeedUp = this.speedUp - this.speedGravity;
			const tangent = resultingSpeedUp / this.speedHorizontal;
			const theta = Math.atan(tangent);
			const hypothenuse = (0.5 * this.holesSize) / Math.cos(theta);
			const height = hypothenuse * Math.sin(theta);
			return incrementSlack * height;
		},
		// flag
		get flagFloorIdx() {
			return Math.round(0.25 * this.floorsNPieces);
		},
		get flagX() {
			const floorIdx = this.flagFloorIdx;
			const floorsXCoordinates = this.floorsXCoordinates;
			const floorXCoordinates = floorsXCoordinates[floorIdx];
			const width = floorXCoordinates.end - floorXCoordinates.start;
			const x = floorXCoordinates.start + 0.5 * width;
			return x;
		},
		get flagPoleHeight() {
			return 0.5 * Math.min(window.innerWidth, this.floorsY);
		},
		get flagPoleWidth() {
			return 0.02 * this.flagPoleHeight;
		},
		get flagWidth() {
			return 0.25 * this.flagPoleHeight;
		},
		get flagHeight() {
			return 0.5 * this.flagWidth;
		},
		flagPoleColor: "#AAAAAA",
		flagColor: "#DDDDDD",
	};
}

initializeConfigs();

function initializeHtmlStyle() {
	document.body.style.color = window.configs.textColor;
	document.body.style.background = window.configs.background;
}
initializeHtmlStyle();

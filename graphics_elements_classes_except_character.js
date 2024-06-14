class GraphicElement {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	wrapAroundLeftRight() {
		if (this.x > 0.5 * params.gameCanvasWidth) {
			this.x -= params.gameCanvasWidth;
		} else if (this.x < -0.5 * params.gameCanvasWidth) {
			this.x += params.gameCanvasWidth;
		}
	}
	updatePosition() {
		if (keys.isLeft) this.x += params.speedHorizontal;
		if (keys.isRight) this.x -= params.speedHorizontal;
		if (keys.isThrusterRight && thrusterPack.isFound)
			this.x -= params.speedHorizontal;
		if (keys.isThrusterLeft && thrusterPack.isFound)
			this.x += params.speedHorizontal;
		this.wrapAroundLeftRight();
	}
}

class Rect extends GraphicElement {
	constructor(
		x,
		y,
		width,
		height,
		color,
		borderColor = color,
		borderWidth = 0
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
	}
	draw() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		// border
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderWidth;
		context.strokeRect(this.x, this.y, this.width, this.height);
	}
	static create(...args) {
		return new this(...args);
	}
}

class Floor extends GraphicElement {
	constructor(
		x,
		y,
		width,
		height,
		floorColor,
		frontHeightProp,
		frontColor,
		borderColor = color,
		borderWidth = 0
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.floorColor = floorColor;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
		this.frontHeightProp = frontHeightProp;
		this.frontColor = frontColor;

		this.floorHeightProp = 1 - frontHeightProp;
		this.floorOffset = 0.5 * height * this.floorHeightProp;

		this.frontHeight = height * frontHeightProp;
		this.yLine = y + height - this.floorOffset - this.frontHeight;
		this.xEnd = x + width;
		this.rects = this.generateRects();
	}
	generateRects() {
		const topSide = new Rect(
			this.x,
			this.y - this.floorOffset,
			this.width,
			this.frontHeight + this.floorOffset,
			this.floorColor,
			this.borderColor,
			this.borderWidth
		);
		const frontSide = new Rect(
			this.x,
			this.yLine,
			this.width,
			this.frontHeight,
			this.frontColor,
			this.borderColor,
			this.borderWidth
		);
		return { topSide, frontSide };
	}
	updatePosition() {
		super.updatePosition();
		this.rects["topSide"].updatePosition();
		this.rects["frontSide"].updatePosition();
	}
	get isOutsideCanvas() {
		return this.x + this.width < 0 || this.x > canvas.width;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.rects["topSide"].draw();
		this.rects["frontSide"].draw();
	}
	static create(...args) {
		return new this(...args);
	}
}

class Floors {
	constructor(
		canvasWidth,
		canvasHeight,
		nPieces,
		widthProp,
		yProp,
		heightProp,
		topSideColor,
		frontSideColor = topSideColor,
		frontSideHeightProp = 0.8,
		borderColor = topSideColor,
		borderWidth = 0
	) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.nPieces = nPieces;
		(this.widthProp = widthProp), (this.yProp = yProp);
		this.heightProp = heightProp;
		this.topSideColor = topSideColor;
		this.frontSideColor = frontSideColor;
		this.frontSideHeightProp = frontSideHeightProp;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;

		this.holesWidthProp = 1 - widthProp;
		this.y = canvasHeight * yProp;
		this.x = 0;
		this.width = canvasWidth;
		this.height = canvasHeight * heightProp;
		this.nHoles = nPieces;
		this.holesSize =
			(this.canvasWidth * this.holesWidthProp) / this.nPieces;
		this.floorsSize = canvasWidth / this.nPieces;
		this.floors = this.generateFloors();
		this.holes = this.generateHoles();
	}
	generateFloorsXCoordinates(_, idx) {
		const coordinates = {};
		coordinates.start =
			idx * this.floorsSize +
			0.5 * this.holesSize -
			0.5 * this.canvasWidth;
		coordinates.end =
			(idx + 1) * this.floorsSize -
			0.5 * this.holesSize -
			0.5 * this.canvasWidth;
		return coordinates;
	}
	get floorsXCoordinates() {
		const xCoordinates = Array(this.nPieces)
			.fill(0)
			.map(this.generateFloorsXCoordinates.bind(this));
		return xCoordinates;
	}
	generateHolesXCoordinates(_, idx) {
		const coordinates = {};
		coordinates.start =
			idx * this.floorsSize -
			0.5 * this.holesSize -
			0.5 * this.canvasWidth;
		coordinates.end =
			idx * this.floorsSize +
			0.5 * this.holesSize -
			0.5 * this.canvasWidth;
		return coordinates;
	}
	get holesXCoordinates() {
		const xCoordinates = Array(this.nPieces + 1)
			.fill(0)
			.map(this.generateHolesXCoordinates.bind(this));
		return xCoordinates;
	}

	generateFloor(coordinates) {
		return new Floor(
			coordinates["start"],
			this.y,
			coordinates["end"] - coordinates["start"],
			this.height,
			this.topSideColor,
			this.frontSideHeightProp,
			this.frontSideColor,
			this.borderColor,
			this.borderWidth
		);
	}
	generateFloors() {
		return this.floorsXCoordinates.map(this.generateFloor.bind(this));
	}
	generateHole(coordinates) {
		return new Rect(
			coordinates["start"],
			this.y,
			coordinates["end"] - coordinates["start"],
			this.height
		);
	}
	generateHoles() {
		return this.holesXCoordinates.map(this.generateHole.bind(this));
	}
	updatePosition() {
		this.floors.map((floor) => floor.updatePosition());
		this.holes.map((hole) => hole.updatePosition());
	}
	draw() {
		for (let idx = 0; idx < this.floors.length; idx++) {
			this.floors[idx].draw();
		}
		// this.floors.map((floor) => floor.draw());
	}
	static create(...args) {
		return new this(...args);
	}
}

class Star extends GraphicElement {
	constructor(x, y, radius, starColor, speed) {
		super(x, y);
		this.radius = radius;
		this.starColor = starColor;
		this.speed = speed;
	}
	get isOutsideCanvas() {
		return this.x < 0 || this.x > canvas.width;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		context.fillStyle = this.starColor;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fill();
		context.closePath();
	}
	updatePosition() {
		super.updatePosition();
		this.x += this.speed;
	}
	static create(...args) {
		return new this(...args);
	}
}

class Stars {
	constructor(canvasWidth, canvasHeight, radius, starColor, nStars, speed) {
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;
		this.nStars = nStars;
		this.radius = radius;
		this.starColor = starColor;
		this.speed = speed;
		this.stars = this.generateStars();
	}
	generateStar() {
		const x = Math.random() * this.canvasWidth - 0.5 * this.canvasWidth;
		const y = Math.random() * this.canvasHeight;
		const radius = Math.random() * this.radius;
		const star = new Star(x, y, radius, this.starColor, this.speed);
		return star;
	}
	generateStars() {
		const stars = Array(this.nStars)
			.fill(0)
			.map(this.generateStar.bind(this));
		return stars;
	}
	draw() {
		this.stars.map((star) => star.draw());
	}
	updatePosition() {
		this.stars.map((star) => star.updatePosition());
	}
	static create(...args) {
		return new this(...args);
	}
}

class Cloud extends GraphicElement {
	constructor(x, y, size, color) {
		super(x, y);
		this.size = size;
		this.color = color;
	}
	get isOutsideCanvas() {
		return (
			this.x + 2 * this.size < 0 || this.x - 2 * this.size > canvas.width
		);
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		context.arc(
			this.x - this.size,
			this.y,
			0.7 * this.size,
			0,
			2 * Math.PI
		);
		context.arc(
			this.x + this.size,
			this.y,
			0.7 * this.size,
			0,
			2 * Math.PI
		);
		context.arc(
			this.x - 1.7 * this.size,
			this.y,
			0.4 * this.size,
			0,
			2 * Math.PI
		);
		context.arc(
			this.x + 1.7 * this.size,
			this.y,
			0.4 * this.size,
			0,
			2 * Math.PI
		);
		context.fill();
		context.closePath();
	}
	static create(...args) {
		return new this(...args);
	}
}

class Clouds {
	constructor(canvasWidth, canvasHeight, size, color, nPieces) {
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;
		this.nPieces = nPieces;
		this.size = size;
		this.color = color;
		this.clouds = this.generateClouds();
	}
	generateCloud() {
		const x = Math.random() * this.canvasWidth - 0.5 * this.canvasWidth;
		const y = Math.random() * this.canvasHeight;
		const size = Math.random() * this.size;
		const cloud = new Cloud(x, y, size, this.color);
		return cloud;
	}
	generateClouds() {
		const clouds = Array(this.nPieces)
			.fill(0)
			.map(this.generateCloud.bind(this));
		return clouds;
	}
	draw() {
		this.clouds.map((cloud) => cloud.draw());
	}
	updatePosition() {
		this.clouds.map((cloud) => cloud.updatePosition());
	}
	static create(...args) {
		return new this(...args);
	}
}

class Tree extends GraphicElement {
	constructor(
		x,
		y,
		width,
		height,
		potColor,
		stemColor,
		canopyColor,
		borderColor
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.potColor = potColor;
		this.stemColor = stemColor;
		this.canopyColor = canopyColor;
		this.borderColor = borderColor;
		this.potHeight = 0.2 * height;
		this.potWidth = 0.3 * width;
		this.canopyHeight = 0.4 * height;
	}
	get xMid() {
		return this.x + 0.5 * this.width;
	}
	drawCanopy() {
		context.fillStyle = this.canopyColor;
		context.beginPath();
		context.arc(
			this.xMid,
			this.y + 0.5 * this.canopyHeight,
			0.4 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		context.arc(
			this.xMid + 0.1 * this.width,
			this.y + 0.5 * this.canopyHeight + 0.1 * this.height,
			0.5 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		context.arc(
			this.xMid - 0.1 * this.width,
			this.y + 0.5 * this.canopyHeight + 0.1 * this.height,
			0.5 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		context.arc(
			this.xMid,
			this.y + 0.5 * this.canopyHeight + 0.15 * this.height,
			0.5 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		context.closePath();
		context.fill();
	}
	drawPot() {
		context.fillStyle = this.potColor;
		context.strokeStyle = this.borderColor;
		context.beginPath();
		context.moveTo(
			this.xMid - 0.5 * this.potWidth,
			this.y + this.height - this.potHeight
		);
		context.lineTo(
			this.xMid + 0.5 * this.potWidth,
			this.y + this.height - this.potHeight
		);
		context.lineTo(this.xMid + 0.4 * this.potWidth, this.y + this.height);
		context.lineTo(this.xMid - 0.4 * this.potWidth, this.y + this.height);
		context.closePath();
		context.fill();
		context.stroke();
	}
	drawStem() {
		Rect.create(
			this.xMid - 0.05 * this.width,
			this.y + this.canopyHeight,
			0.1 * this.width,
			this.height - this.canopyHeight,
			this.stemColor,
			this.borderColor
		).draw();
	}
	get isOutsideCanvas() {
		return this.x + this.width < 0 || this.x > canvas.width;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.drawStem();
		this.drawPot();
		this.drawCanopy();
	}
	static create(...args) {
		return new this(...args);
	}
}

class Trees {
	constructor(width, height, potColor, stemColor, canopyColor, borderColor) {
		this.width = width;
		this.height = height;
		this.potColor = potColor;
		this.stemColor = stemColor;
		this.canopyColor = canopyColor;
		this.borderColor = borderColor;
		this.y = floors.y - height;
		this.x = this.extractFloorsXMids();
		this.trees = this.generateTrees();
	}
	extractFloorsXMids() {
		return floors.floors.map(
			(floor) => floor.x + 0.5 * floor.width - 0.5 * this.width
		);
	}
	generateTrees() {
		const trees = this.x.map((x) =>
			Tree.create(
				x,
				this.y,
				this.width,
				this.height,
				this.potColor,
				this.stemColor,
				this.canopyColor,
				this.borderColor
			)
		);
		return trees;
	}
	draw() {
		this.trees.map((tree) => tree.draw());
	}
	updatePosition() {
		this.trees.map((tree) => tree.updatePosition());
	}
	static create(...args) {
		return new this(...args);
	}
}

class ThrustersPack extends Rect {
	constructor(x, y, width, height, color, borderColor, borderWidth) {
		super(x, y, width, height, color, borderColor, borderWidth);
		this.flapHeight = height * 0.2;
		this.pocketWidth = width * 0.6;
		this.pocketHeight = height * 0.3;
		this.isFound = false;
		this.pocketY = y + height - this.pocketHeight;
	}
	drawFlap() {
		Rect.create(
			this.x,
			this.y - this.flapHeight,
			this.width,
			this.flapHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawPocket2() {
		Rect.create(
			this.x + this.width * 0.3,
			this.pocketY,
			this.pocketWidth,
			this.pocketHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawPocket() {
		Rect.create(
			this.x + this.width * 0.1,
			this.pocketY,
			this.pocketWidth,
			this.pocketHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawSpecificElements() {
		this.drawFlap();
		this.drawPocket();
		this.drawPocket2();
	}
	draw() {
		if (this.isFound) return null;
		super.draw();
		this.drawSpecificElements();
	}
}

class OxygenPack extends GraphicElement {
	constructor(
		x,
		y,
		width,
		height,
		color,
		borderColor = color,
		borderWidth = 0,
		jittering = 0,
		speed = 0
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
		this.jittering = jittering;
		this.isFound = false;
		this.speedX = speed * Math.sign(Math.random() - 0.5);
		this.speedY = speed * Math.sign(Math.random() - 0.5);
		this.radius = 0.5 * this.width;
	}
	drawMiddle() {
		Rect.create(
			this.x,
			this.y + this.radius,
			this.width,
			this.height - 2 * this.radius,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawTopCircle() {
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderWidth;
		context.beginPath();
		context.arc(
			this.x + 0.5 * this.width,
			this.y + this.radius,
			this.radius,
			Math.PI,
			0
		);
		context.closePath();
		context.fill();
		context.stroke();
	}
	drawBottomCircle() {
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderWidth;
		context.beginPath();
		context.arc(
			this.x + 0.5*this.width,
			this.y + this.height - this.radius,
			this.radius,
			0,
			Math.PI
		);
		context.closePath();
		context.fill();
		context.stroke();
	}
	addText() {
		context.textAlign = "center";
		context.fillStyle = params.textColor;
		context.fillText(
			"O2",
			this.x + 0.5 * this.width,
			this.y + 0.5 * this.height
		);
	}
	get isOutsideCanvas() {
		return this.x + this.width < 0 || this.x > canvas.width;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		if (this.isFound) return null;
		this.drawMiddle();
		this.drawTopCircle();
		this.drawBottomCircle();
		this.addText();
	}
	jitterPosition() {
		this.x += this.jittering * (Math.random() - 0.5);
		this.y += this.jittering * (Math.random() - 0.5);
	}
	drift() {
		this.y += this.speedY;
		this.x += this.speedX;
	}
	wrapGoinDown() {
		if (this.y > canvas.height && this.speedY > 0)
			this.y -= canvas.height + this.height;
	}
	wrapGoingUp() {
		if (this.y + this.height < 0 && this.speedY < 0)
			this.y += canvas.height + this.height;
	}
	wrapAroundTopBottom() {
		this.wrapGoinDown();
		this.wrapGoingUp();
	}
	updatePosition() {
		super.updatePosition();
		this.jitterPosition();
		this.drift();
		this.wrapAroundTopBottom();
	}
	static create(...args) {
		return new this(...args);
	}
}

class OxygenPacks {
	constructor(
		nPieces,
		width,
		height,
		color,
		borderColor,
		borderWidth = 0,
		jittering = 0,
		speed = 0
	) {
		this.nPieces = nPieces;
		this.width = width;
		this.height = height;
		this.color = color;
		this.borderWidth = borderWidth;
		this.borderColor = borderColor;
		this.jittering = jittering;
		this.speed = speed;
		this.oxygenPacks = this.generateOxygenPacks();
	}
	get x() {
		return Math.random() * params.gameCanvasWidth;
	}
	get y() {
		return (Math.random() + 0.5) * 0.5 * params.floorYProp * canvas.height;
	}
	generateOxygenPack() {
		return new OxygenPack(
			this.x,
			this.y,
			this.width,
			this.height,
			this.color,
			this.borderColor,
			this.borderWidth,
			this.jittering,
			this.speed
		);
	}
	generateOxygenPacks() {
		const oxygenPacks = Array(this.nPieces)
			.fill(0)
			.map(this.generateOxygenPack.bind(this));
		return oxygenPacks;
	}
	draw() {
		this.oxygenPacks.map((oxygenPack) => oxygenPack.draw());
	}
	updatePosition() {
		this.oxygenPacks.map((oxygenPack) => oxygenPack.updatePosition());
	}
	static create(...args) {
		return new this(...args);
	}
}

class Mountain extends GraphicElement {
	constructor(x, y, width, height, color, borderColor) {
		super(x, y);
		this.height = height;
		this.width = width;
		this.color = color;
		this.borderColor = borderColor;
	}
	drawTriangle(x1, y1, x2, y2, x3, y3) {
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineTo(x3, y3);
		context.closePath();
		context.fill();
		context.stroke();
	}
	get isOutsideCanvas() {
		return this.x + this.width < 0 || this.x > canvas.width;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.drawTriangle(
			this.x + 0.2 * this.width,
			this.y + 0.05 * this.height,
			this.x + 0.4 * this.width,
			this.y + this.height,
			this.x,
			this.y + this.height
		);
		this.drawTriangle(
			this.x + 0.3 * this.width,
			this.y,
			this.x + 0.6 * this.width,
			this.y + this.height,
			this.x,
			this.y + this.height
		);
		this.drawTriangle(
			this.x + 0.7 * this.width,
			this.y + 0.15 * this.height,
			this.x + this.width,
			this.y + this.height,
			this.x + 0.4 * this.width,
			this.y + this.height
		);
		this.drawTriangle(
			this.x + 0.5 * this.width,
			this.y + 0.3 * this.height,
			this.x + 0.2 * this.width,
			this.y + this.height,
			this.x + 0.8 * this.width,
			this.y + this.height
		);
		this.drawTriangle(
			this.x + 0.7 * this.width,
			this.y + 0.7 * this.height,
			this.x + 0.4 * this.width,
			this.y + this.height,
			this.x + 1 * this.width,
			this.y + this.height
		);
	}
}

class Planet extends GraphicElement {
	constructor(x, y, radius, color, speed) {
		super(x, y);
		this.radius = radius;
		this.color = color;
		this.speed = speed;
	}
	get isOutsideCanvas() {
		return this.x + this.radius < 0 || this.x - this.radius > canvas.width;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.fill();
	}
	updatePosition() {
		super.updatePosition();
		this.x += this.speed;
	}
}

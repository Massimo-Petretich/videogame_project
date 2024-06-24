class GraphicElement {
	constructor(x, y) {
		this.x = x;
		this.xCamera = x;
		this.y = y;
	}
	wrapAroundLeftRight() {
		if (this.xCamera > 0.5 * window.configs.gameCanvasWidth) {
			this.xCamera -= window.configs.gameCanvasWidth;
		} else if (this.xCamera < -0.5 * window.configs.gameCanvasWidth) {
			this.xCamera += window.configs.gameCanvasWidth;
		}
	}
	updatePosition() {
		this.xCamera = this.x - window.gameSession.cameraXCoordinate;
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
		context,
		borderColor = color,
		borderWidth = 0
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.context = context;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
	}
	draw() {
		this.context.fillStyle = this.color;
		this.context.fillRect(this.xCamera, this.y, this.width, this.height);
		// border
		this.context.strokeStyle = this.borderColor;
		this.context.lineWidth = this.borderWidth;
		this.context.strokeRect(this.xCamera, this.y, this.width, this.height);
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
		context,
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
		this.context = context;

		this.floorHeightProp = 1 - frontHeightProp;
		this.floorOffset = 0.5 * height * this.floorHeightProp;

		this.frontHeight = height * frontHeightProp;
		this.yLine = y + height - this.floorOffset - this.frontHeight;
		this.xCameraEnd = x + width;
		this.rects = this.generateRects();
	}
	generateRects() {
		const topSide = new Rect(
			this.xCamera,
			this.y - this.floorOffset,
			this.width,
			this.frontHeight + this.floorOffset,
			this.floorColor,
			this.context,
			this.borderColor,
			this.borderWidth
		);
		const frontSide = new Rect(
			this.xCamera,
			this.yLine,
			this.width,
			this.frontHeight,
			this.frontColor,
			this.context,
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
		return (
			this.xCamera + this.width < 0 || this.xCamera > window.innerWidth
		);
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
		x,
		y,
		height,
		topSideColor,
		frontSideColor = topSideColor,
		context,
		frontSideHeightProp = 0.8,
		borderColor = topSideColor,
		borderWidth = 0
	) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.topSideColor = topSideColor;
		this.frontSideColor = frontSideColor;
		this.context = context;
		this.frontSideHeightProp = frontSideHeightProp;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
		this.floors = this.generateFloors();
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
			this.context,
			this.borderColor,
			this.borderWidth
		);
	}
	generateFloors() {
		return this.x.map(this.generateFloor.bind(this));
	}
	updatePosition() {
		this.floors.map((floor) => floor.updatePosition());
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

class Holes {
	constructor(x) {
		this.x = x;
		this.holes = this.generateHoles();
	}
	generateHole(coordinates) {
		return new Rect(
			coordinates["start"],
			null,
			coordinates["end"] - coordinates["start"],
			null
		);
	}
	generateHoles() {
		return this.x.map(this.generateHole.bind(this));
	}
	updatePosition() {
		this.holes.map((hole) => hole.updatePosition());
	}
	draw() {
		return null;
	}
}
class Star extends GraphicElement {
	constructor(x, y, radius, starColor, speed, context) {
		super(x, y);
		this.radius = radius;
		this.starColor = starColor;
		this.speed = speed;
		this.context = context;
	}
	get isOutsideCanvas() {
		return this.xCamera < 0 || this.xCamera > window.innerWidth;
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.context.fillStyle = this.starColor;
		this.context.beginPath();
		this.context.arc(this.xCamera, this.y, this.radius, 0, 2 * Math.PI);
		this.context.fill();
		this.context.closePath();
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
	constructor(starsParams, starColor, speed, context) {
		this.starsParams = starsParams;
		this.starColor = starColor;
		this.speed = speed;
		this.context = context;
		this.stars = this.generateStars();
	}
	generateStar(starsParams) {
		return new Star(
			starsParams.x,
			starsParams.y,
			starsParams.radius,
			this.starColor,
			this.speed,
			this.context
		);
	}
	generateStars() {
		return this.starsParams.map(this.generateStar.bind(this));
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
	constructor(x, y, size, color, context) {
		super(x, y);
		this.size = size;
		this.color = color;
		this.context = context;
	}
	get isOutsideCanvas() {
		return (
			this.xCamera + 2 * this.size < 0 ||
			this.xCamera - 2 * this.size > window.innerWidth
		);
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.context.fillStyle = this.color;
		this.context.beginPath();
		this.context.arc(this.xCamera, this.y, this.size, 0, 2 * Math.PI);
		this.context.arc(
			this.xCamera - this.size,
			this.y,
			0.7 * this.size,
			0,
			2 * Math.PI
		);
		this.context.arc(
			this.xCamera + this.size,
			this.y,
			0.7 * this.size,
			0,
			2 * Math.PI
		);
		this.context.arc(
			this.xCamera - 1.7 * this.size,
			this.y,
			0.4 * this.size,
			0,
			2 * Math.PI
		);
		this.context.arc(
			this.xCamera + 1.7 * this.size,
			this.y,
			0.4 * this.size,
			0,
			2 * Math.PI
		);
		this.context.fill();
		this.context.closePath();
	}
	static create(...args) {
		return new this(...args);
	}
}

class Clouds {
	constructor(cloudsParams, color, context) {
		this.cloudsParams = cloudsParams;
		this.color = color;
		this.context = context;
		this.clouds = this.generateClouds();
	}
	generateCloud(cloudParams) {
		return new Cloud(
			cloudParams.x,
			cloudParams.y,
			cloudParams.size,
			this.color,
			this.context
		);
	}
	generateClouds() {
		return this.cloudsParams.map(this.generateCloud.bind(this));
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
		borderColor,
		context
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.potColor = potColor;
		this.stemColor = stemColor;
		this.canopyColor = canopyColor;
		this.borderColor = borderColor;
		this.context = context;
		this.potHeight = 0.2 * height;
		this.potWidth = 0.3 * width;
		this.canopyHeight = 0.4 * height;
	}
	get xCameraMid() {
		return this.xCamera + 0.5 * this.width;
	}
	drawCanopy() {
		this.context.fillStyle = this.canopyColor;
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid,
			this.y + 0.5 * this.canopyHeight,
			0.4 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		this.context.arc(
			this.xCameraMid + 0.1 * this.width,
			this.y + 0.5 * this.canopyHeight + 0.1 * this.height,
			0.5 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		this.context.arc(
			this.xCameraMid - 0.1 * this.width,
			this.y + 0.5 * this.canopyHeight + 0.1 * this.height,
			0.5 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		this.context.arc(
			this.xCameraMid,
			this.y + 0.5 * this.canopyHeight + 0.15 * this.height,
			0.5 * this.canopyHeight,
			0,
			2 * Math.PI
		);
		this.context.closePath();
		this.context.fill();
	}
	drawPot() {
		this.context.fillStyle = this.potColor;
		this.context.strokeStyle = this.borderColor;
		this.context.beginPath();
		this.context.moveTo(
			this.xCameraMid - 0.5 * this.potWidth,
			this.y + this.height - this.potHeight
		);
		this.context.lineTo(
			this.xCameraMid + 0.5 * this.potWidth,
			this.y + this.height - this.potHeight
		);
		this.context.lineTo(
			this.xCameraMid + 0.4 * this.potWidth,
			this.y + this.height
		);
		this.context.lineTo(
			this.xCameraMid - 0.4 * this.potWidth,
			this.y + this.height
		);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	}
	drawStem() {
		Rect.create(
			this.xCameraMid - 0.05 * this.width,
			this.y + this.canopyHeight,
			0.1 * this.width,
			this.height - this.canopyHeight,
			this.stemColor,
			this.context,
			this.borderColor
		).draw();
	}
	get isOutsideCanvas() {
		return (
			this.xCamera + this.width < 0 || this.xCamera > window.innerWidth
		);
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
	constructor(
		x,
		width,
		height,
		potColor,
		stemColor,
		canopyColor,
		borderColor,
		context
	) {
		this.x = x;
		this.width = width;
		this.height = height;
		this.potColor = potColor;
		this.stemColor = stemColor;
		this.canopyColor = canopyColor;
		this.borderColor = borderColor;
		this.context = context;
		this.y = window.configs.floorsY - height;
		this.trees = this.generateTrees();
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
				this.borderColor,
				this.context
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
	constructor(x, y, width, height, color, borderColor, borderWidth, context) {
		super(x, y, width, height, color, context, borderColor, borderWidth);
		this.flapHeight = height * 0.2;
		this.pocketWidth = width * 0.6;
		this.pocketHeight = height * 0.3;
		this.isFound = false;
		this.pocketY = y + height - this.pocketHeight;
	}
	drawFlap() {
		Rect.create(
			this.xCamera,
			this.y - this.flapHeight,
			this.width,
			this.flapHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawPocket2() {
		Rect.create(
			this.xCamera + this.width * 0.3,
			this.pocketY,
			this.pocketWidth,
			this.pocketHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawPocket() {
		Rect.create(
			this.xCamera + this.width * 0.1,
			this.pocketY,
			this.pocketWidth,
			this.pocketHeight,
			this.color,
			this.context,
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
		speedX,
		speedY,
		width,
		height,
		color,
		textColor,
		context,
		borderColor = color,
		borderWidth = 0,
		jittering = 0
	) {
		super(x, y);
		this.speedX = speedX;
		this.speedY = speedY;
		this.width = width;
		this.height = height;
		this.color = color;
		this.textColor = textColor;
		this.context = context;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
		this.jittering = jittering;
		this.isFound = false;
		this.radius = 0.5 * this.width;
	}
	drawMiddle() {
		Rect.create(
			this.xCamera,
			this.y + this.radius,
			this.width,
			this.height - 2 * this.radius,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawTopCircle() {
		this.context.fillStyle = this.color;
		this.context.strokeStyle = this.borderColor;
		this.context.lineWidth = this.borderWidth;
		this.context.beginPath();
		this.context.arc(
			this.xCamera + 0.5 * this.width,
			this.y + this.radius,
			this.radius,
			Math.PI,
			0
		);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	}
	drawBottomCircle() {
		this.context.fillStyle = this.color;
		this.context.strokeStyle = this.borderColor;
		this.context.lineWidth = this.borderWidth;
		this.context.beginPath();
		this.context.arc(
			this.xCamera + 0.5 * this.width,
			this.y + this.height - this.radius,
			this.radius,
			0,
			Math.PI
		);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	}
	addText() {
		this.context.textAlign = "center";
		this.context.fillStyle = this.textColor;
		this.context.fillText(
			"O2",
			this.xCamera + 0.5 * this.width,
			this.y + 0.5 * this.height
		);
	}
	get isOutsideCanvas() {
		return (
			this.xCamera + this.width < 0 || this.xCamera > window.innerWidth
		);
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
		if (this.jittering <= 0) return null;
		this.x += this.jittering * (Math.random() - 0.5);
		this.y += this.jittering * (Math.random() - 0.5);
	}
	drift() {
		this.y += this.speedY;
		this.x += this.speedX;
	}
	wrapGoinDown() {
		if (this.y > window.innerHeight && this.speedY > 0)
			this.y -= window.innerHeight + this.height;
	}
	wrapGoingUp() {
		if (this.y + this.height < 0 && this.speedY < 0)
			this.y += window.innerHeight + this.height;
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
		oxygenPacksParams,
		width,
		height,
		color,
		textColor,
		borderColor,
		context,
		borderWidth = 0,
		jittering = 0
	) {
		this.oxygenPacksParams = oxygenPacksParams;
		this.width = width;
		this.height = height;
		this.color = color;
		this.textColor = textColor;
		this.borderWidth = borderWidth;
		this.borderColor = borderColor;
		this.context = context;
		this.jittering = jittering;
		this.oxygenPacks = this.generateOxygenPacks();
	}
	get foundCount() {
		return this.oxygenPacks
			.map((oxygenPack) => (oxygenPack.isFound ? 1 : 0))
			.reduce((a, b) => a + b);
	}
	generateOxygenPack(oxygenPacksParam) {
		return new OxygenPack(
			oxygenPacksParam.x,
			oxygenPacksParam.y,
			oxygenPacksParam.speedX,
			oxygenPacksParam.speedY,
			this.width,
			this.height,
			this.color,
			this.textColor,
			this.context,
			this.borderColor,
			this.borderWidth,
			this.jittering
		);
	}
	generateOxygenPacks() {
		const oxygenPacks = this.oxygenPacksParams.map(
			this.generateOxygenPack.bind(this)
		);
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
	constructor(x, y, width, height, color, borderColor, context) {
		super(x, y);
		this.height = height;
		this.width = width;
		this.color = color;
		this.borderColor = borderColor;
		this.context = context;
	}
	drawTriangle(x1, y1, x2, y2, x3, y3) {
		this.context.fillStyle = this.color;
		this.context.strokeStyle = this.borderColor;
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.lineTo(x3, y3);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	}
	get isOutsideCanvas() {
		return (
			this.xCamera + this.width < 0 || this.xCamera > window.innerWidth
		);
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.drawTriangle(
			this.xCamera + 0.2 * this.width,
			this.y + 0.05 * this.height,
			this.xCamera + 0.4 * this.width,
			this.y + this.height,
			this.xCamera,
			this.y + this.height
		);
		this.drawTriangle(
			this.xCamera + 0.3 * this.width,
			this.y,
			this.xCamera + 0.6 * this.width,
			this.y + this.height,
			this.xCamera,
			this.y + this.height
		);
		this.drawTriangle(
			this.xCamera + 0.7 * this.width,
			this.y + 0.15 * this.height,
			this.xCamera + this.width,
			this.y + this.height,
			this.xCamera + 0.4 * this.width,
			this.y + this.height
		);
		this.drawTriangle(
			this.xCamera + 0.5 * this.width,
			this.y + 0.3 * this.height,
			this.xCamera + 0.2 * this.width,
			this.y + this.height,
			this.xCamera + 0.8 * this.width,
			this.y + this.height
		);
		this.drawTriangle(
			this.xCamera + 0.7 * this.width,
			this.y + 0.7 * this.height,
			this.xCamera + 0.4 * this.width,
			this.y + this.height,
			this.xCamera + 1 * this.width,
			this.y + this.height
		);
	}
}

class Planet extends GraphicElement {
	constructor(x, y, radius, color, speed, context) {
		super(x, y);
		this.radius = radius;
		this.color = color;
		this.speed = speed;
		this.context = context;
	}
	get isOutsideCanvas() {
		return (
			this.xCamera + this.radius < 0 ||
			this.xCamera - this.radius > window.innerWidth
		);
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.context.fillStyle = this.color;
		this.context.beginPath();
		this.context.arc(this.xCamera, this.y, this.radius, 0, Math.PI * 2, true);
		this.context.fill();
	}
	updatePosition() {
		super.updatePosition();
		this.x += this.speed;
	}
}

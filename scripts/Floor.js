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

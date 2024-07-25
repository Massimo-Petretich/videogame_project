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
		const trees = this.x.map((x) => Tree.create(
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

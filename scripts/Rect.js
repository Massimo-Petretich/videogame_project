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

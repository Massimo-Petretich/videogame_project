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

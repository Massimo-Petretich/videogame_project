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
		this.context.arc(
			this.xCamera,
			this.y,
			this.radius,
			0,
			Math.PI * 2,
			true
		);
		this.context.fill();
	}
	updatePosition() {
		super.updatePosition();
		this.x += this.speed;
	}
}

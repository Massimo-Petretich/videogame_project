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

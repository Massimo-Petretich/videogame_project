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

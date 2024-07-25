class Enemy extends GraphicElement {
	constructor(x, y, radius, color, speed, leftBound, rightBound, context) {
		super(x, y);
		this.radius = radius;
		this.color = color;
		this.speed = speed;
		this.leftBound = leftBound;
		this.rightBound = rightBound;
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
	bounceOnBounds() {
		const exceedsLeft =
			this.speed < 0 && this.x - this.radius < this.leftBound;
		const exceedsRight =
			this.speed > 0 && this.x + this.radius > this.rightBound;
		if (exceedsLeft || exceedsRight) this.speed = -this.speed;
	}
	updatePosition() {
		super.updatePosition();
		this.bounceOnBounds();
		this.x += this.speed;
	}
}

class Enemies {
	constructor(enemiesParams, color, radius, context) {
		this.enemiesParams = enemiesParams;
		this.color = color;
		this.context = context;
		this.radius = radius;
		this.enemies = this.generateEnemies();
	}
	generateEnemy(enemyParams) {
		return new Enemy(
			enemyParams.x,
			enemyParams.y,
			this.radius,
			this.color,
			enemyParams.speed,
			enemyParams.leftBound,
			enemyParams.rightBound,
			this.context
		);
	}
	generateEnemies() {
		return this.enemiesParams.map(this.generateEnemy.bind(this));
	}
	draw() {
		this.enemies.map((enemy) => enemy.draw());
	}
	updatePosition() {
		this.enemies.map((enemy) => enemy.updatePosition());
	}
}

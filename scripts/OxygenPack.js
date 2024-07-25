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

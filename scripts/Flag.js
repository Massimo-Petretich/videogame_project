class Flag extends GraphicElement {
	constructor(
		x,
		poleHeight,
		poleWidth,
		flagWidth,
		flagHeight,
		poleColor,
		flagColor,
		context
	) {
		super(x, window.configs.floorsY - poleHeight);
		this.poleHeight = poleHeight;
		this.poleWidth = poleWidth;
		this.flagWidth = flagWidth;
		this.flagHeight = flagHeight;
		this.poleColor = poleColor;
		this.flagColor = flagColor;
		this.context = context;
		this.isReached = false;
		this.poleOnlyHeight = this.poleHeight - this.flagHeight;
		this.flagMaxY = this.y + 0.1 * this.poleOnlyHeight;
		this.flagMinY = this.y + 0.9 * this.poleOnlyHeight;
	}
	get isOutsideCanvas() {
		return (
			this.xCamera + this.flagSize < 0 || this.xCamera > window.innerWidth
		);
	}
	drawPole() {
		this.context.beginPath();
		this.context.strokeStyle = this.poleColor;
		this.context.lineWidth = this.poleWidth;
		this.context.moveTo(this.xCamera, this.y);
		this.context.lineTo(this.xCamera, this.y + this.poleHeight);
		this.context.stroke();
	}
	drawFlag() {
		Rect.create(
			this.xCamera + 0.5 * this.poleWidth,
			this.isReached ? this.flagMaxY : this.flagMinY,
			this.isReached ? this.flagWidth : 0.1 * this.flagWidth,
			this.flagHeight,
			this.flagColor,
			this.context
		).draw();
	}
	draw() {
		if (this.isOutsideCanvas) return null;
		this.drawPole();
		this.drawFlag();
	}
	updatePosition() {
		super.updatePosition();
	}
}

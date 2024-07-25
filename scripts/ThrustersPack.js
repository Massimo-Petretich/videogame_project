class ThrustersPack extends Rect {
	constructor(x, y, width, height, color, borderColor, borderWidth, context) {
		super(x, y, width, height, color, context, borderColor, borderWidth);
		this.flapHeight = height * 0.2;
		this.pocketWidth = width * 0.6;
		this.pocketHeight = height * 0.3;
		this.isFound = false;
		this.pocketY = y + height - this.pocketHeight;
		this.fillLevel = 100;
		this.isExhausted = false;
	}
	drawFlap() {
		Rect.create(
			this.xCamera,
			this.y - this.flapHeight,
			this.width,
			this.flapHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawPocket2() {
		Rect.create(
			this.xCamera + this.width * 0.3,
			this.pocketY,
			this.pocketWidth,
			this.pocketHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawPocket() {
		Rect.create(
			this.xCamera + this.width * 0.1,
			this.pocketY,
			this.pocketWidth,
			this.pocketHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawSpecificElements() {
		this.drawFlap();
		this.drawPocket();
		this.drawPocket2();
	}
	draw() {
		if (this.isExhausted) return null;
		if (this.isFound) return null;
		super.draw();
		this.drawSpecificElements();
	}
}

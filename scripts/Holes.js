class Holes {
	constructor(x) {
		this.x = x;
		this.holes = this.generateHoles();
	}
	generateHole(coordinates) {
		return new Rect(
			coordinates["start"],
			null,
			coordinates["end"] - coordinates["start"],
			null
		);
	}
	generateHoles() {
		return this.x.map(this.generateHole.bind(this));
	}
	updatePosition() {
		this.holes.map((hole) => hole.updatePosition());
	}
	draw() {
		return null;
	}
}

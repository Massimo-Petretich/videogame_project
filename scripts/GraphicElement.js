class GraphicElement {
	constructor(x, y) {
		this.x = x;
		this.xCamera = x;
		this.y = y;
	}
	wrapAroundLeftRight() {
		if (this.xCamera > 0.5 * window.configs.gameCanvasWidth) {
			this.xCamera -= window.configs.gameCanvasWidth;
		} else if (this.xCamera < -0.5 * window.configs.gameCanvasWidth) {
			this.xCamera += window.configs.gameCanvasWidth;
		}
	}
	updatePosition() {
		this.xCamera = this.x - window.gameSession.cameraXCoordinate;
		this.wrapAroundLeftRight();
	}
}

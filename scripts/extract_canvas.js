function scaleCanvasElement() {
	const canvas = document.getElementById("canvas2D");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
scaleCanvasElement();
window.addEventListener("resize", scaleCanvasElement);
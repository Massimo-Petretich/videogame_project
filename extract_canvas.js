window.canvas = document.getElementById("canvas2D");
window.context = window.canvas.getContext("2d");
function scaleCanvasElement() {
	window.canvas.width = window.innerWidth;
	window.canvas.height = window.innerHeight;
}
scaleCanvasElement();
window.addEventListener("resize", scaleCanvasElement);
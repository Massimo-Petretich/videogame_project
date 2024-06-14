const canvas = document.getElementById("canvas2D");
const context = canvas.getContext("2d");
function scaleCanvasElement() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
scaleCanvasElement();
window.addEventListener("resize", scaleCanvasElement);
window.addEventListener('resize', location.reload);
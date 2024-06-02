const canvas = document.getElementById("canvas2D");
const context = canvas.getContext("2d");
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener('resize', location.reload);
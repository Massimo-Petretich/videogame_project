let keys = {
	isLeft: false,
	isRight: false,
	isJumping: false,
	isThrusterUp: false,
	isThrusterDown: false,
	isThrusterLeft: false,
	isThrusterRight: false,
	isInfo: false,
	isClearInfo: false,
};

const handleKey = (event, status) => {
	if (
		window.gameSession.gameState === "game over" ||
		window.gameSession.gameState === "game ended" ||
		window.gameSession.gameState === "mission accomplished"
	)
		return null;

	const element = document.getElementById("key-info")
	element.textContent = `Key: ${event.key}, Code: ${event.code}`;

	switch (event.key) {
		case "ArrowUp":
			keys.isThrusterUp = status;
			break;
		case "ArrowLeft":
			keys.isThrusterLeft = status;
			break;
		case "ArrowRight":
			keys.isThrusterRight = status;
			break;
		case "ArrowDown":
			keys.isThrusterDown = status;
			break;
		case "w":
			keys.isJumping = status;
			break;
		case "a":
			keys.isLeft = status;
			break;
		case "d":
			keys.isRight = status;
			break;
		case "h":
			keys.isInfo = status;
			break;
		case "c":
			keys.isClearInfo = status;
			break;
	}
};

document.addEventListener("keyup", (event) => handleKey(event, false));
document.addEventListener("keydown", (event) => handleKey(event, true));

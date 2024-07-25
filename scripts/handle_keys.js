window.keys = {
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
	switch (window.gameSession.gameState) {
		case "game over":
			return null;
		case "locked":
			return null;
		case "level completed":
			return null;
		case "tasks accomplished":
			return null;
	}

	const element = document.getElementById("key-info");
	element.textContent = `Key: ${event.key}, Code: ${event.code}`;

	switch (event.key) {
		case "ArrowUp":
			window.keys.isThrusterUp = status;
			break;
		case "ArrowLeft":
			window.keys.isThrusterLeft = status;
			break;
		case "ArrowRight":
			window.keys.isThrusterRight = status;
			break;
		case "ArrowDown":
			window.keys.isThrusterDown = status;
			break;
		case "w":
			window.keys.isJumping = status;
			break;
		case "a":
			window.keys.isLeft = status;
			break;
		case "d":
			window.keys.isRight = status;
			break;
		case "h":
			window.keys.isInfo = status;
			break;
		case "c":
			window.keys.isClearInfo = status;
			break;
	}
};

document.addEventListener("keyup", (event) => handleKey(event, false));
document.addEventListener("keydown", (event) => handleKey(event, true));

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
		case "GAME OVER":
			return null;
		case "locked":
			return null;
		case "LEVEL COMPLETED":
			return null;
		case "tasks accomplished":
			return null;
	}

	const element = document.getElementById("key-info");

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
			element.textContent = "";
			break;
		case "a":
			window.keys.isLeft = status;
			element.textContent = "";
			break;
		case "d":
			window.keys.isRight = status;
			element.textContent = "";
			break;
		case "h":
			window.keys.isInfo = status;
			element.textContent = "";
			break;
		case "c":
			window.keys.isClearInfo = status;
			element.textContent = "";
			break;

		case "W":
			element.textContent = "UPPERCASE NOT ACCEPTED";
			break;
		case "A":
			element.textContent = "UPPERCASE NOT ACCEPTED";
			break;
		case "D":
			element.textContent = "UPPERCASE NOT ACCEPTED";
			break;
		case "H":
			element.textContent = "UPPERCASE NOT ACCEPTED";
			break;
		case "C":
			element.textContent = "UPPERCASE NOT ACCEPTED";
			break;
	}
};

document.addEventListener("keyup", (event) => handleKey(event, false));
document.addEventListener("keydown", (event) => handleKey(event, true));

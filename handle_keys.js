const handleKey = (event, status) => {
	if (gameSession.isGameOver) { //isGameOver defined in draw.js
		return null
	}
	const element = document.getElementById("key-info");
	element.dataset.key = event.key;
	element.dataset.code = event.code;
	element.textContent = `Key: ${event.key}, Code: ${event.code}`;
	
	// console.log(element.dataset);
	switch (event.key) {
		case 'ArrowUp':
			keys.isThrusterUp = status;
			break;
		case 'ArrowLeft':
			keys.isThrusterLeft = status;
			break;
		case 'ArrowRight':
			keys.isThrusterRight = status;
			break;
		case 'ArrowDown':
			keys.isThrusterDown = status;
			break;
		case 'w':
			keys.isJumping = status;
			break;
		case 'a':
			keys.isLeft = status;
			break;
		case 'd':
			keys.isRight = status;
			break;
			
	}
}

document.addEventListener("keyup", (event) => handleKey(event, false));
document.addEventListener("keydown", (event) => handleKey(event, true));


// const getKey = () => document.getElementById("key-info").dataset.key
// const getKeyCode = () => document.getElementById("key-info").dataset.code
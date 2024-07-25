function playSound(sound) {
    let audio;
    switch (sound) {
		case "jump":
			audio = new Audio('sounds/laser.wav');
            audio.volume = 0.3;
            break;
		case "jumpLand":
			audio = new Audio('sounds/jump_land.mp3');
            break;
		case "collect":
			audio = new Audio('sounds/collected.mp3');
            break;
        case "game over":
			audio = new Audio('sounds/game_over.mp3');
            break;
        case "level completed":
            audio = new Audio('sounds/level_completed.wav');
            break;
        case "lost life":
            audio = new Audio('sounds/lost_life.wav');
            audio.volume = 0.3;
            break;
	}  
    audio.play();
}
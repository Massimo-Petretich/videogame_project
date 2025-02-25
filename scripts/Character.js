class Character {
	constructor(
		x,
		y,
		width,
		height,
		color,
		context,
		borderColor = color,
		borderWidth = 0,
		backpackColor = "#777777",
		hasThrusterPack = false
	) {
		this.x = x;
		this.xCamera = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.context = context;
		this.borderColor = borderColor;
		this.borderWidth = borderWidth;
		this.backpackColor = backpackColor;
		this.bodyWidth = width * 0.6;
		this.bodyHeight = height * 0.3;
		this.headRadius = width * 0.25;
		this.limbWidth = width * 0.2;
		this.limbHeight = height * 0.32;
		this.backpackWidth = width * 0.8;
		this.backpackHeight = height * 0.35;
		this.shoeWidth = width * 0.15;
		this.shoeHeight = height * 0.08;
		this.canJump = true;
		this.isPlummeting = false;
		this.hasThrusterPack = hasThrusterPack;
		this.oxygenLevel = 100;
	}
	get xCameraMid() {
		return this.xCamera + 0.5 * this.width;
	}
	get yMid() {
		return this.y + 0.5 * this.height;
	}
	get yBody() {
		return this.y + 0.4 * this.height;
	}
	get yHeadCenter() {
		return this.yBody - this.headRadius + 0.02 * this.height;
	}
	get yThrustersPack() {
		return this.yBody - 0.05 * this.height;
	}
	get yArm() {
		return this.yBody + 0.05 * this.height;
	}
	get backpackDepth() {
		return 0.3 * this.backpackWidth;
	}
	centerDist(x, y) {
		const xDist = this.xCameraMid - x;
		const yDist = this.yMid - y;
		return Math.sqrt(xDist ** 2 + yDist ** 2);
	}
	xDist(x) {
		const xDist = this.xCameraMid - x;
		return Math.abs(xDist);
	}
	get isBelowFloor() {
		return this.y > window.configs.floorsY - this.height;
	}
	get touchesFloor() {
		return this.y === window.configs.floorsY - this.height;
	}
	stopOnFloor() {
		this.y = Math.min(this.y, window.configs.floorsY - this.height);
	}
	get isbelowCanvasBottom() {
		return this.y + this.height >= window.innerHeight;
	}
	get isAboveCanvasTop() {
		return this.y <= 0;
	}
	stopOnCanvasBottom() {
		this.y = window.innerHeight - this.height;
	}
	isWithinXHole(hole) {
		return (
			this.xCameraMid > hole.xCamera &&
			this.xCameraMid < hole.xCamera + hole.width
		);
	}
	isWithinXHoles(holes) {
		return holes
			.map(this.isWithinXHole.bind(this))
			.some((element) => element);
	}
	isWithinXPlatform(platform) {
		return (
			this.xCameraMid > platform.xCamera &&
			this.xCameraMid < platform.xCamera + platform.width
		);
	}
	isWithinXPlatforms(platforms) {
		return platforms
			.map(this.isWithinXPlatform.bind(this))
			.some((element) => element);
	}
	stopOnPlatform() {
		this.y = Math.min(this.y, window.configs.platformsY - this.height);
	}
	get isAbovePlatform() {
		return this.y + this.height <= window.configs.platformsY;
	}
	get touchesPlatform() {
		return this.y + this.height === window.configs.platformsY;
	}
	updatePosition(holes, platforms, keys) {
		const isWithinXPlatforms = this.isWithinXPlatforms(platforms);
		const isAbovePlatform = this.isAbovePlatform;
		if (
			keys.isThrusterUp &&
			this.hasThrusterPack &&
			!(!isAbovePlatform && isWithinXPlatforms)
		) {
			this.y -= window.configs.speedUp;
			window.gameSession.decrementThrusterPackFill();
		}
		if (keys.isThrusterDown && this.hasThrusterPack) {
			this.y += window.configs.speedDown;
			window.gameSession.decrementThrusterPackFill();
		}
		if (
			keys.isJumping &&
			this.canJump &&
			!this.isPlummeting &&
			!(!isAbovePlatform && isWithinXPlatforms)
		) {
			window.gameSession.playSound("jump");
			window.gameSession.decrementOxygenLevel(
				window.configs.characterOxygenLevelDecrementJump
			);
			this.y -= window.configs.jumpHeight;
			this.canJump = false;
		}
		if (!this.canJump && (this.touchesFloor || this.touchesPlatform)) {
			this.canJump = true; //can jump again only if touches the floor
			window.gameSession.playSound("jumpLand");
		}
		this.y += window.configs.speedGravity;
		if (this.isAboveCanvasTop) this.y = 0;
		const isWithinXHoles = this.isWithinXHoles(holes);
		if (isWithinXHoles && this.isBelowFloor) this.isPlummeting = true;
		if (!isWithinXHoles && !this.isPlummeting) this.stopOnFloor();
		if (isWithinXPlatforms && isAbovePlatform) this.stopOnPlatform();
	}

	draw(position) {
		switch (position) {
			case "facingForward":
				this.drawFacingForward();
				break;
			case "jumpingFacingForward":
				this.drawJumpingFacingForward();
				break;
			case "walkingRight":
				this.drawWalkingRight();
				break;
			case "walkingLeft":
				this.drawWalkingLeft();
				break;
			case "jumpingRight":
				this.drawJumpingRight();
				break;
			case "jumpingLeft":
				this.drawJumpingLeft();
				break;
			case "broken":
				this.drawBroken();
				break;
			default:
				console.error("Invalid position");
		}
	}
	drawForwardThrustersPack() {
		Rect.create(
			this.xCameraMid - 0.5 * this.backpackWidth,
			this.yThrustersPack,
			this.backpackWidth,
			this.backpackHeight,
			this.backpackColor,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardBody() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardBlueDot() {
		this.context.fillStyle = "blue";
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid + 0.25 * this.bodyWidth,
			this.yBody + 0.25 * this.bodyHeight,
			0.1 * this.bodyWidth,
			0,
			Math.PI * 2,
			true
		);
		this.context.fill();
	}
	drawForwardHead() {
		this.context.fillStyle = this.color;
		this.context.strokeStyle = this.borderColor;
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid,
			this.yHeadCenter,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		this.context.fill();
		this.context.stroke();
	}
	drawForwardHelmetVisor() {
		this.context.fillStyle = this.borderColor;
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid,
			this.yHeadCenter,
			0.8 * this.headRadius,
			-0.2 * Math.PI,
			-0.8 * Math.PI,
			false
		);
		this.context.fill();
	}
	drawForwardLeftArm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightArm() {
		Rect.create(
			this.xCameraMid + 0.5 * this.bodyWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardLeftForearm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightForearm() {
		Rect.create(
			this.xCameraMid + 0.5 * this.bodyWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightForeleg() {
		Rect.create(
			this.xCameraMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.y + this.height * 0.9,
			this.limbWidth,
			this.shoeHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardLeftForeleg() {
		Rect.create(
			this.xCameraMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.y + this.height * 0.9,
			this.limbWidth,
			this.shoeHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightLeg() {
		Rect.create(
			this.xCameraMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardLeftLeg() {
		Rect.create(
			this.xCameraMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardJumpRightLeg() {
		Rect.create(
			this.xCameraMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			0.5 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardJumpLeftLeg() {
		Rect.create(
			this.xCameraMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			0.5 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawTopBodyFacingForward() {
		if (this.hasThrusterPack) this.drawForwardThrustersPack();
		this.drawForwardBody();
		this.drawForwardBlueDot();
		this.drawForwardHead();
		this.drawForwardHelmetVisor();
		this.drawForwardLeftArm();
		this.drawForwardRightArm();
		this.drawForwardLeftForearm();
		this.drawForwardRightForearm();
	}
	drawFacingForward() {
		this.drawForwardLeftLeg();
		this.drawForwardRightLeg();
		this.drawForwardLeftForeleg();
		this.drawForwardRightForeleg();
		this.drawTopBodyFacingForward();
	}
	drawJumpingFacingForward() {
		this.drawForwardJumpLeftLeg();
		this.drawForwardJumpRightLeg();
		this.drawTopBodyFacingForward();
	}

	drawRightRightArm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightHelmetVisor() {
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid + 0.3 * this.headRadius,
			this.yHeadCenter,
			0.7 * this.headRadius,
			-Math.PI * 0.2,
			-Math.PI * 0.8,
			false
		);
		this.context.fillStyle = this.borderColor;
		this.context.fill();
		this.context.stroke();
	}
	drawRightHead() {
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid,
			this.yHeadCenter,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		this.context.fillStyle = this.color;
		this.context.fill();
		this.context.stroke();
	}
	drawRightBody() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightThrustersPack() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth - this.backpackDepth,
			this.yThrustersPack,
			this.backpackDepth,
			this.backpackHeight,
			this.backpackColor,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightRightForearm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightBackShoe() {
		Rect.create(
			this.xCameraMid - this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightForwardShoe() {
		Rect.create(
			this.xCameraMid,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightForwardLeg() {
		Rect.create(
			this.xCameraMid,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightBackLeg() {
		Rect.create(
			this.xCameraMid - this.limbWidth,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightJumpingBottomLeg() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yBody + this.bodyHeight + this.limbWidth,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightJumpingTopLeg() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yBody + this.bodyHeight,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawTopBodyRigth() {
		if (this.hasThrusterPack) this.drawRightThrustersPack();
		this.drawRightBody();
		this.drawRightHead();
		this.drawRightHelmetVisor();
		this.drawRightRightArm();
		this.drawRightRightForearm();
	}
	drawWalkingRight() {
		this.drawRightBackLeg();
		this.drawRightForwardLeg();
		this.drawRightForwardShoe();
		this.drawRightBackShoe();
		this.drawTopBodyRigth();
	}
	drawJumpingRight() {
		this.drawRightJumpingTopLeg();
		this.drawRightJumpingBottomLeg();
		this.drawTopBodyRigth();
	}

	drawLeftLeftForearm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftLeftArm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftHelmetVisor() {
		this.context.fillStyle = this.borderColor;
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid - 0.3 * this.headRadius,
			this.yHeadCenter,
			0.7 * this.headRadius,
			-Math.PI * 0.2,
			-Math.PI * 0.8,
			false
		);
		this.context.fill();
	}
	drawLeftHead() {
		this.context.fillStyle = this.color;
		this.context.strokeStyle = this.borderColor;
		this.context.beginPath();
		this.context.arc(
			this.xCameraMid,
			this.yHeadCenter,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		this.context.fill();
		this.context.stroke();
	}
	drawLeftBody() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftThrustersPack() {
		Rect.create(
			this.xCameraMid + 0.5 * this.bodyWidth,
			this.yThrustersPack,
			this.backpackDepth,
			this.backpackHeight,
			this.backpackColor,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftBackShoe() {
		Rect.create(
			this.xCameraMid - 1.5 * this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftForwardShoe() {
		Rect.create(
			this.xCameraMid - 0.5 * this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftLeftBackLeg() {
		Rect.create(
			this.xCameraMid,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftForwardLeg() {
		Rect.create(
			this.xCameraMid - this.limbWidth,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftJumpingTopLeg() {
		Rect.create(
			this.xCameraMid -
				0.5 * this.bodyWidth +
				this.limbWidth -
				0.35 * this.limbHeight,
			this.yBody + this.bodyHeight + this.limbWidth,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftJumpingBottomLeg() {
		Rect.create(
			this.xCameraMid -
				0.5 * this.bodyWidth +
				this.limbWidth -
				0.35 * this.limbHeight,
			this.yBody + this.bodyHeight,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawTopBodyLeft() {
		if (this.hasThrusterPack) this.drawLeftThrustersPack();
		this.drawLeftBody();
		this.drawLeftHead();
		this.drawLeftHelmetVisor();
		this.drawLeftLeftArm();
		this.drawLeftLeftForearm();
	}
	drawWalkingLeft() {
		this.drawLeftForwardLeg();
		this.drawLeftLeftBackLeg();
		this.drawLeftForwardShoe();
		this.drawLeftBackShoe();
		this.drawTopBodyLeft();
	}
	drawJumpingLeft() {
		this.drawLeftJumpingBottomLeg();
		this.drawLeftJumpingTopLeg();
		this.drawTopBodyLeft();
	}

	drawBrokenRightLeg() {
		Rect.create(
			this.xCameraMid,
			this.y + this.height - this.limbHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenLeftLeg() {
		Rect.create(
			this.xCamera + this.width,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenRightArm() {
		Rect.create(
			this.xCameraMid,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenLeftArm() {
		Rect.create(
			this.xCameraMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenHelmetVisor() {
		Rect.create(
			this.xCamera + this.width - 0.7 * this.headRadius,
			this.y + this.height - 1.4 * this.headRadius,
			1.4 * this.headRadius,
			1.4 * this.headRadius,
			this.borderColor,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenHead() {
		this.context.fillStyle = this.color;
		this.context.strokeStyle = this.borderColor;
		this.context.beginPath();
		this.context.arc(
			this.xCamera + this.width,
			this.y + this.height - this.headRadius,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		this.context.fill();
		this.context.stroke();
	}
	drawBrokenBody() {
		Rect.create(
			this.xCamera,
			this.y + this.height - this.bodyHeight,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenThrustersPack() {
		Rect.create(
			this.xCameraMid - 0.5 * this.backpackWidth,
			this.y + this.height - this.backpackHeight,
			this.backpackWidth,
			this.backpackHeight,
			this.backpackColor,
			this.context,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBroken() {
		if (this.hasThrusterPack) this.drawBrokenThrustersPack();
		this.drawBrokenBody();
		this.drawBrokenHead();
		this.drawBrokenHelmetVisor();
		this.drawBrokenLeftArm();
		this.drawBrokenRightArm();
		this.drawBrokenLeftLeg();
		this.drawBrokenRightLeg();
	}
}

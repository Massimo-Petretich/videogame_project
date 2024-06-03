class Character {
	constructor(
		x,
		y,
		width,
		height,
		color = "#FFFFFF",
		borderColor = color,
		borderWidth = 0,
		backpackColor = "#777777"
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
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
		this.xOrientation = "right";
		this.yOrientation = "down";
		this.hasThrustersPack = false;
		this.hasOxygenPack = false;
	}
	get xMid() {
		return this.x + 0.5 * this.width;
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
		const xDist = this.xMid - x;
		const yDist = this.yMid - y;
		return Math.sqrt(xDist ** 2 + yDist ** 2);
	}

	isBelowFloor() {
		return this.y > floors.y - this.height;
	}
	touchesFloor() {
		return this.y + this.height == floors.y;
	}
	touchesCanvasBottom() {
		return this.y + this.height == canvas.height;
	}
	isWithinXHole(hole) {
		return this.xMid > hole.x && this.xMid < hole.x + hole.width;
	}
	isWithinXHoles() {
		const isWithinXHoles = floors.holes.map(this.isWithinXHole.bind(this));
		return isWithinXHoles.some((element) => element);
	}
	getBottom = () => {
		if (this.isWithinXHoles()) {
			return canvas.height;
		} else {
			return floors.y;
		}
	};

	updatePosition() {
		if (keys.isLeft) {
			this.xOrientation = "left";
		}
		if (keys.isRight) {
			this.xOrientation = "right";
		}
		if (keys.isThrusterRight && this.hasThrustersPack) {
			this.xOrientation = "right";
		}
		if (keys.isThrusterLeft && this.hasThrustersPack) {
			this.xOrientation = "left";
		}
		if (keys.isThrusterUp && this.hasThrustersPack) {
			this.y -= params.speedUp;
			this.yOrientation = "up";
		}
		if (keys.isThrusterDown && this.hasThrustersPack) {
			this.y += params.speedDown;
			this.yOrientation = "down";
		}
		if (keys.isJumping && this.canJump) {
			let jumpHeight = floors.y - (this.y + this.height);
			if (jumpHeight <= params.jumpHeight) {
				let jumpRemainder = params.jumpHeight - jumpHeight;
				if (jumpRemainder > params.speedUp) {
					this.y -= params.speedUp;
					this.yOrientation = "up";
				} else {
					this.y -= jumpRemainder;
					this.canJump = false;
					this.yOrientation = "down";
				}
			}
		}
		//whenever released cannot jump unless touches the floor
		if (!keys.isJumping) this.canJump = false;
		//can jump again only if touches the floor
		if (!this.canJump && this.touchesFloor()) this.canJump = true;
		this.y += params.speedGravity;
		this.y = Math.min(this.y, this.getBottom() - this.height);
		// this.y = Math.max(this.y, 0); // stop from going above canvas
		// if (this.y <= 0) this.y += 0.2 * canvas.height; // bounce when touches top
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
			this.xMid - 0.5 * this.backpackWidth,
			this.yThrustersPack,
			this.backpackWidth,
			this.backpackHeight,
			this.backpackColor,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardBody() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardBlueDot() {
		context.fillStyle = "blue";
		context.beginPath();
		context.arc(
			this.xMid + 0.25 * this.bodyWidth,
			this.yBody + 0.25 * this.bodyHeight,
			0.1 * this.bodyWidth,
			0,
			Math.PI * 2,
			true
		);
		context.fill();
	}
	drawForwardHead() {
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.beginPath();
		context.arc(
			this.xMid,
			this.yHeadCenter,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		context.fill();
		context.stroke();
	}
	drawForwardHelmetVisor() {
		context.fillStyle = this.borderColor;
		context.beginPath();
		context.arc(
			this.xMid,
			this.yHeadCenter,
			0.8 * this.headRadius,
			-0.2 * Math.PI,
			-0.8 * Math.PI,
			false
		);
		context.fill();
	}
	drawForwardLeftArm() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightArm() {
		Rect.create(
			this.xMid + 0.5 * this.bodyWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardLeftForearm() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightForearm() {
		Rect.create(
			this.xMid + 0.5 * this.bodyWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightForeleg() {
		Rect.create(
			this.xMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.y + this.height * 0.9,
			this.limbWidth,
			this.shoeHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardLeftForeleg() {
		Rect.create(
			this.xMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.y + this.height * 0.9,
			this.limbWidth,
			this.shoeHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardRightLeg() {
		Rect.create(
			this.xMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardLeftLeg() {
		Rect.create(
			this.xMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawForwardJumpRightLeg() {
		Rect.create(
			this.xMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			0.5 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
			).draw();
		}
	drawForwardJumpLeftLeg() {
		Rect.create(
			this.xMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			0.5 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
			).draw();
		}
	drawTopBodyFacingForward() {
		if (this.hasThrustersPack) this.drawForwardThrustersPack();
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
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightHelmetVisor() {
		context.beginPath();
		context.arc(
			this.xMid + 0.3 * this.headRadius,
			this.yHeadCenter,
			0.7 * this.headRadius,
			-Math.PI * 0.2,
			-Math.PI * 0.8,
			false
		);
		context.fillStyle = this.borderColor;
		context.fill();
		context.stroke();
	}
	drawRightHead() {
		context.beginPath();
		context.arc(
			this.xMid,
			this.yHeadCenter,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		context.fillStyle = this.color;
		context.fill();
		context.stroke();
	}
	drawRightBody() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightThrustersPack() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.backpackDepth,
			this.yThrustersPack,
			this.backpackDepth,
			this.backpackHeight,
			this.backpackColor,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightRightForearm() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightBackShoe() {
		Rect.create(
			this.xMid - this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightForwardShoe() {
		Rect.create(
			this.xMid,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightForwardLeg() {
		Rect.create(
			this.xMid,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightBackLeg() {
		Rect.create(
			this.xMid - this.limbWidth,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawRightJumpingBottomLeg() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yBody + this.bodyHeight + this.limbWidth,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
			).draw();
		}
	drawRightJumpingTopLeg() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yBody + this.bodyHeight,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
			).draw();
		}
	drawTopBodyRigth() {
		if (this.hasThrustersPack) this.drawRightThrustersPack();
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
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftLeftArm() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftHelmetVisor() {
		context.fillStyle = this.borderColor;
		context.beginPath();
		context.arc(
			this.xMid - 0.3 * this.headRadius,
			this.yHeadCenter,
			0.7 * this.headRadius,
			-Math.PI * 0.2,
			-Math.PI * 0.8,
			false
		);
		context.fill();
	}
	drawLeftHead() {
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.beginPath();
		context.arc(
			this.xMid,
			this.yHeadCenter,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		context.fill();
		context.stroke();
	}
	drawLeftBody() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftThrustersPack() {
		Rect.create(
			this.xMid + 0.5 * this.bodyWidth,
			this.yThrustersPack,
			this.backpackDepth,
			this.backpackHeight,
			this.backpackColor,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftBackShoe() {
		Rect.create(
			this.xMid - 1.5 * this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftForwardShoe() {
		Rect.create(
			this.xMid - 0.5 * this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftLeftBackLeg() {
		Rect.create(
			this.xMid,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftForwardLeg() {
		Rect.create(
			this.xMid - this.limbWidth,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftJumpingTopLeg() {
		Rect.create(
			this.xMid -
			0.5 * this.bodyWidth +
			this.limbWidth -
			0.35 * this.limbHeight,
			this.yBody + this.bodyHeight + this.limbWidth,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawLeftJumpingBottomLeg() {
		Rect.create(
			this.xMid -
				0.5 * this.bodyWidth +
				this.limbWidth -
				0.35 * this.limbHeight,
			this.yBody + this.bodyHeight,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawTopBodyLeft() {
		if (this.hasThrustersPack) this.drawLeftThrustersPack();
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
			this.xMid,
			this.y + this.height - this.limbHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenLeftLeg() {
		Rect.create(
			this.x + this.width,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenRightArm() {
		Rect.create(
			this.xMid,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenLeftArm() {
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenHelmetVisor() {
		Rect.create(
			this.x + this.width - 0.7 * this.headRadius,
			this.y + this.height - 1.4 * this.headRadius,
			1.4 * this.headRadius,
			1.4 * this.headRadius,
			this.borderColor,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenHead() {
		context.fillStyle = this.color;
		context.strokeStyle = this.borderColor;
		context.beginPath();
		context.arc(
			this.x + this.width,
			this.y + this.height - this.headRadius,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		context.fill();
		context.stroke();
	}
	drawBrokenBody() {
		Rect.create(
			this.x,
			this.y + this.height - this.bodyHeight,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBrokenThrustersPack() {
		Rect.create(
			this.xMid - 0.5 * this.backpackWidth,
			this.y + this.height - this.backpackHeight,
			this.backpackWidth,
			this.backpackHeight,
			this.backpackColor,
			this.borderColor,
			this.borderWidth
		).draw();
	}
	drawBroken() {
		if (this.hasThrustersPack) this.drawBrokenThrustersPack();
		this.drawBrokenBody();
		this.drawBrokenHead();
		this.drawBrokenHelmetVisor();
		this.drawBrokenLeftArm();
		this.drawBrokenRightArm();
		this.drawBrokenLeftLeg();
		this.drawBrokenRightLeg();
	}
}

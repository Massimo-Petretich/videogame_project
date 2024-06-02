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
				let jumpRemainder = params.jumpHeight - jumpHeight
				if (jumpRemainder > params.speedUp) {
					this.y -= params.speedUp;
					this.yOrientation = "up";
				} else {
					this.y -=jumpRemainder
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
		// Rect.create(this.x, this.y, this.width, this.height, 'red').draw()
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

	drawTopBodyFacingForward() {
		if (this.hasThrustersPack)
			Rect.create(
				this.xMid - 0.5 * this.backpackWidth,
				this.yThrustersPack,
				this.backpackWidth,
				this.backpackHeight,
				this.backpackColor,
				this.borderColor,
				this.borderWidth
			).draw();
		// Draw body
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// draw blue dot
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
		context.stroke();
		// Draw head
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
		// Draw helmet visor
		context.fillStyle=this.borderColor
		context.beginPath();
		context.arc(
			this.xMid,
			this.yHeadCenter,
			0.8*this.headRadius,
			-0.2*Math.PI,
			-0.8*Math.PI,
			false
		);
		context.fill();
		// Draw left arm
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw right arm
		Rect.create(
			this.xMid + 0.5 * this.bodyWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// draw hands
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.yArm + 0.5 * this.limbHeight,
			this.limbWidth,
			0.35 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
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

	drawFacingForward() {
		// Draw left leg
		Rect.create(
			this.xMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw right leg
		Rect.create(
			this.xMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw shoes
		Rect.create(
			this.xMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.y + this.height * 0.9,
			this.limbWidth,
			this.shoeHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		Rect.create(
			this.xMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.y + this.height * 0.9,
			this.limbWidth,
			this.shoeHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		this.drawTopBodyFacingForward();
	}

	drawJumpingFacingForward() {
		// Draw left leg
		Rect.create(
			this.xMid - 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			0.5 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw right leg
		Rect.create(
			this.xMid + 0.25 * this.bodyWidth - this.limbWidth * 0.5,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			0.5 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		this.drawTopBodyFacingForward();
	}

	drawTopBodyRigth() {
		if (this.hasThrustersPack)
			Rect.create(
				this.xMid - 0.5 * this.bodyWidth - this.backpackDepth,
				this.yThrustersPack,
				this.backpackDepth,
				this.backpackHeight,
				this.backpackColor,
				this.borderColor,
				this.borderWidth
			).draw();
		// Draw body
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw head
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
		// Draw helmet visor (seen from the side)
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
		// Draw right arm
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// draw hands
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

	drawWalkingRight() {
		// Draw legs
		Rect.create(
			this.xMid - this.limbWidth,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		Rect.create(
			this.xMid,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// draw shoes
		Rect.create(
			this.xMid,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		Rect.create(
			this.xMid - this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		this.drawTopBodyRigth();
	}

	drawTopBodyLeft() {
		if (this.hasThrustersPack)
			Rect.create(
				this.xMid + 0.5 * this.bodyWidth,
				this.yThrustersPack,
				this.backpackDepth,
				this.backpackHeight,
				this.backpackColor,
				this.borderColor,
				this.borderWidth
			).draw();
		// Draw body
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth,
			this.yBody,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw head
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
		// Draw helmet visor (seen from the side)
		context.beginPath();
		context.arc(
			this.xMid - 0.3 * this.headRadius,
			this.yHeadCenter,
			0.7 * this.headRadius,
			-Math.PI * 0.2,
			-Math.PI * 0.8,
			false
		);
		context.fillStyle = this.borderColor;
		context.fill();
		context.stroke();
		// Draw left arm
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yArm,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// draw hands
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

	drawWalkingLeft() {
		// Draw legs
		Rect.create(
			this.xMid - this.limbWidth,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		Rect.create(
			this.xMid,
			this.yBody + this.bodyHeight,
			this.limbWidth,
			this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		Rect.create(
			this.xMid - 0.5 * this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// draw shoe
		Rect.create(
			this.xMid - 1.5 * this.limbWidth,
			this.yBody + this.bodyHeight + 0.85 * this.limbHeight,
			1.5 * this.limbWidth,
			0.15 * this.limbHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		this.drawTopBodyLeft();
	}

	drawJumpingRight() {
		// Draw left leg (protruding forward)
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yBody + this.bodyHeight,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth + this.limbWidth,
			this.yBody + this.bodyHeight + this.limbWidth,
			0.7 * this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		this.drawTopBodyRigth();
	}

	drawJumpingLeft() {
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
		this.drawTopBodyLeft();
	}

	drawBroken() {
		if (this.hasThrustersPack)
			Rect.create(
				this.xMid - 0.5 * this.backpackWidth,
				this.y + this.height - this.backpackHeight,
				this.backpackWidth,
				this.backpackHeight,
				this.backpackColor,
				this.borderColor,
				this.borderWidth
			).draw();
		// Draw body
		Rect.create(
			this.x,
			this.y + this.height - this.bodyHeight,
			this.bodyWidth,
			this.bodyHeight,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw head
		context.beginPath();
		context.arc(
			this.x + this.width,
			this.y + this.height - this.headRadius,
			this.headRadius,
			0,
			Math.PI * 2,
			true
		);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		// Draw helmet visor with semicircles
		Rect.create(
			this.x + this.width - 0.7 * this.headRadius,
			this.y + this.height - 1.4 * this.headRadius,
			1.4 * this.headRadius,
			1.4 * this.headRadius,
			this.borderColor,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw left arm
		Rect.create(
			this.xMid - 0.5 * this.bodyWidth - this.limbWidth,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();

		// Draw right arm
		Rect.create(
			this.xMid,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw left leg
		Rect.create(
			this.x + this.width,
			this.y + this.height - this.limbWidth,
			this.limbHeight,
			this.limbWidth,
			this.color,
			this.borderColor,
			this.borderWidth
		).draw();
		// Draw right leg
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
}

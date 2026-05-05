import Game from '../game.js';
import Snake from '../models/snake.js';

export default class SnakeController {
	constructor(context, boardController, snakeBody, snakeHead) {
		this.init(boardController);
		this.render(context, boardController, snakeBody, snakeHead);
	}
	init(boardController) {
		this.deltaX = 0;
		this.deltaY = -1;
		this.snake = new Snake();
		this.degree = 180;

		for (let coord of this.snake.snakeStartCoords) {
			let cell = boardController.getCell(coord.x, coord.y);
			this.snake.snakeCoords.push(cell);
		}
	}
	render(context, boardController, snakeBody, snakeHead) {
		this.boardController = boardController;
		const halfHeadSize = snakeHead.width / 2;
		this.snake.snakeCoords.forEach((cell, i) => {
			window.requestAnimationFrame(() => {
				if (i === 0) {
					context.save();
					context.translate(
						cell.x * boardController.cellWidth +
							boardController.offsetX,
						cell.y * boardController.cellheight +
							boardController.offsetY,
					);
					context.translate(halfHeadSize, halfHeadSize);
					context.rotate((this.degree * Math.PI) / 180);
					context.drawImage(snakeHead, -halfHeadSize, -halfHeadSize);
					context.restore();
				} else {
					context.drawImage(
						snakeBody,
						cell.x * boardController.cellWidth +
							boardController.offsetX,
						cell.y * boardController.cellheight +
							boardController.offsetY,
					);
				}
			});
		});
	}
	move() {
		if (!this.snake.isMoving) {
			return;
		}
		let cell = this.getNextCell();
		if (!cell || this.snake.snakeCoords.includes(cell)) {
			this.gameOver = true;
			return;
		}

		if (cell) {
			this.snake.snakeCoords.unshift(cell);
			if (cell.hasFood) {
				this.playFood = true;
				this.boardController.removeObject(cell, 'food');
				this.boardController.addFood(this);
				this.slow=false;
				return;
			}
			if (cell.hasBomb) {	
				this.playBomb = true;
				if (this.eatbomb){
				//	this.snakehead = 'https://liquidcake-cool.github.io/snake-js/images/head.png';
					this.boardController.removeObject(cell, 'bomb');
					this.boardController.addBomb(this);
					this.eatbomb=false;
				} else{
					this.gameOver = true; 
				}
				
			}
			if (cell.hasPu) {
				this.playpu = true;
				this.boardController.removeObject(cell, 'pu');
				
				console.log(this.boardController.punumber);
				if (this.boardController.punumber==0){
					this.slow=true;
				} else if (this.boardController.punumber==1){
					this.boardController.addFood(this);
				} else {// able to eat bomb
					this.eatbomb= true;
				}
				this.boardController.addPu(this);
				//return;
			}
			this.snake.snakeCoords.pop();
		}
	}
	/*getNextCell() {
		let head = this.snake.snakeCoords[0];
		return this.boardController.getCell(
			head.x + this.deltaX,
			head.y + this.deltaY,
		);
	}*/
	getNextCell() {
		let head = this.snake.snakeCoords[0];
		let nextX = head.x + this.deltaX;
		let nextY = head.y + this.deltaY;
		
		// Wrapping logica - zijkanten
		const boardWidth = this.boardController.boardWidth;
		const boardHeight = this.boardController.boardHeight;
		
		if (nextX < 0) {
			nextX = boardWidth - 1;  // Links uitgang → rechts ingang
		} else if (nextX >= boardWidth) {
			nextX = 0;  // Rechts uitgang → links ingang
		}
		
		if (nextY < 0) {
			nextY = boardHeight - 1;  // Boven uitgang → beneden ingang
		} else if (nextY >= boardHeight) {
			nextY = 0;  // Beneden uitgang → boven ingang
		}
		
		return this.boardController.getCell(nextX, nextY);
	}
}

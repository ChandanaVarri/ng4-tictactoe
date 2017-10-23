import { ElementRef, Renderer2, ViewChild, ViewChildren, QueryList, Component } from '@angular/core';

let ticTacToeBoard = [], tempListener, cells;
const humanPlayer = "red";
const aiPlayer = "blue" ;

const WINCOMBINATION = [
  	[0, 1, 2],
  	[0, 3, 6],
  	[0, 4, 8],
  	[1, 4, 7],
  	[2, 5, 8],
  	[6, 4, 2],
  	[3, 4, 5],
  	[6, 7, 8]
  ];

let showAlert = {
	'color' : '',
	'msg': '',
	'show': false
}  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  winningcombination = WINCOMBINATION;
  showalert = showAlert;
  disableHover = true;

  /* Get parent element of cells */
  constructor (private renderer: Renderer2){}
  @ViewChild('parentElem') parentElem: ElementRef;

  ngOnInit(){
  	cells = this.parentElem.nativeElement.getElementsByTagName('BUTTON');
  	this.resetGame();
  }

  /* Reset Game*/
  resetGame(): void{
  	//Create a array that contains numbers from 0-9
  	ticTacToeBoard = Array.from(Array(9).keys());

  	/* to shw notification about the game */
  	this.showalert = {
		'color' : '',
		'msg': '',
		'show': false
	}

	/* Add event Listener to parent, so thet it can handle any cell click */
  	tempListener = this.renderer.listen(this.parentElem.nativeElement, 'click', (ev) => {
		if(typeof ticTacToeBoard[ev.target.id] == 'number'){
			this.whoseTurn(ev.target.id, humanPlayer);
			if(!this.checkDraw()){
				this.whoseTurn(this.chooseCell(), aiPlayer)
			}
		}
  	});

  	for(let i=0; i<cells.length; i++){
  		cells[i].style.backgroundColor = "#C0C0C0";
  	}
  	
  }

  /* to show the whose os current player */
  whoseTurn(cellId, player):void{
	ticTacToeBoard[cellId] = player;
	if(player == humanPlayer){
		cells[cellId].style.backgroundColor = "#d9534f";
	}else{
		cells[cellId].style.backgroundColor = "#5bc0de";
	}	
	let gameStatus = this.checkWinner(ticTacToeBoard, player);
 	if(gameStatus){
		this.gameComplete(gameStatus);
	} 
  }

  /* Check for winner */
  checkWinner(board, player):void{
  	let win = null;
  	let playerSelections = board.reduce((a, e, i) => ( e === player )? a.concat(i): a, []);
	this.winningcombination.forEach((value, key) => {
  		if(value.every(elem => playerSelections.indexOf(elem) > -1)){
  			win = {index:key, player:player};
  		}
  	});

  	return win;
  }

  /* show notification after game completed */
  gameComplete(gameWon):void{
  	tempListener();
  	if(gameWon.player == humanPlayer){
  		this.disableHover = false;
	  	this.showalert = {
			'color': 'alert-danger',
			'msg': "Congratulations, You won the game!!!:)",
			'show': true
		}
	}else if(gameWon.player == aiPlayer){
		this.disableHover = false;
		this.showalert = {
  			'color': 'alert-info',
  			'msg': "Sorry, You lost the game.",
  			'show': true
  		}
	}
  }

  /* get how many empty cells are there */
  emptyCell(){
  	return ticTacToeBoard.filter(s => typeof s == 'number');
  }

  /* call minmax algorithm to choose best move for ai player */
  chooseCell(): void{
  	return this.minmax(ticTacToeBoard, aiPlayer).index;	
  }

  /* check if the game is a draw */
  checkDraw(){
  	if(this.emptyCell().length == 0){
  		for(let i=0; i<cells.length; i++){
  			cells[i].style.backgroundColor = "green";
  		}
  		tempListener();
  		this.showalert = {
  			'color': 'alert-success',
  			'msg': "Draw",
  			'show': true
  		}

  		return true;
  	}

  	return false
  }

  /* minmax algorithm to choose best move for aiPlayer */
  minmax(chooseCellBoard, player){
  	let possibleMoves = [], bestMove;
  	let availableCells = this.emptyCell();

 	if(this.checkWinner(chooseCellBoard, humanPlayer)){
 		return {score: -10};
 	}else if (this.checkWinner(chooseCellBoard, aiPlayer)){
 		return {score: 10};
 	}else if (availableCells.length == 0){
 		return {score: 0};
 	}

 	for(let i=0; i < availableCells.length; i++){
 		let eachMove = {};
 		eachMove['index'] = chooseCellBoard[availableCells[i]];
 		chooseCellBoard[availableCells[i]] = player;

 		if(player == aiPlayer){
 			let result = this.minmax(chooseCellBoard, humanPlayer);
 			eachMove['score'] = result.score;
 		}else{
 			let result = this.minmax(chooseCellBoard, aiPlayer);
 			eachMove['score'] = result.score;
 		}

 		chooseCellBoard[availableCells[i]] = eachMove['index'];
 		possibleMoves.push(eachMove);
 	}	

	if(player === aiPlayer){
		let bestScore = -10000;
		for(let i=0; i<possibleMoves.length; i++){
			if(possibleMoves[i].score > bestScore){
				bestScore = possibleMoves[i].score;
				bestMove = i;
			}
		}
	}else{
		let bestScore =	 10000;
		for(let i=0; i<possibleMoves.length; i++){
			if(possibleMoves[i].score < bestScore){
				bestScore = possibleMoves[i].score;
				bestMove = i;
			}
		}
	}

	return possibleMoves[bestMove];
  }

  /* to avoid memory leaks on destroy remove event listeners */
  ngOnDestroy(){
  	tempListener();
  }

}
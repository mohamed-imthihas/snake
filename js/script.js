var cells = [];
var snakeCell = [[24,0],[24,1],[24,2]];
var direction = 'right';
var intervalInstance = null;
var score = 0;
var preyPosition = [];
var popCell = [];
var isPaused = false;
var isGameover = false;
var highscore =0;
var generateLayout = function(){
	var gameArea = $('.gameArea');
	for(var i=0;i<50;i++){
		var row=$("<div>")
		$(row).addClass("single-row");
		cells[i]=[];
		for(var j=0;j<50;j++){
			var cell = $("<div>");
			$(cell).addClass("cell");
			$(row).append(cell);
			cells[i].push(cell);
		}
		$(gameArea).append(row);
	}
}
var placePrey = function(){
	var x=0;
	var y=0;
	do{
		x=Math.floor(Math.random()*50);
		y=Math.floor(Math.random()*50);
	}while(isAlready(x,y,snakeCell));
	preyPosition=[x,y]
}
var render = function(){
	for(var i=0;i<50;i++){
		for(var j=0;j<50;j++){
			cells[i][j].css("background-color","white");
		}
	}
	cells[preyPosition[0]][preyPosition[1]].css("background-color","red");
	for(var i=0;i<snakeCell.length;i++){
		var x=snakeCell[i][0];
		var y=snakeCell[i][1];
		cells[x][y].css("background-color","black");
	}
}
var moveSnake = function(){
	popCell = snakeCell[0];
	snakeCell.splice(0,1);
	var lastPos = snakeCell[snakeCell.length-1];
	if(direction == 'right'){
		snakeCell.push([lastPos[0],lastPos[1]+1]);
	}
	if(direction == 'left'){
		snakeCell.push([lastPos[0],lastPos[1]-1]);	
	}
	if(direction == 'up'){
		snakeCell.push([lastPos[0]-1,lastPos[1]]);	
	}
	if(direction == 'down'){
		snakeCell.push([lastPos[0]+1,lastPos[1]]);	
	}
	if(checkSnake()){
		render();
	}
	
}
var checkSnake = function(){
	var lastPos = snakeCell[snakeCell.length-1];
	if(isAlready(lastPos[0],lastPos[1],snakeCell)||lastPos[0] > 49 || lastPos[0] < 0 || lastPos[1] > 49 || lastPos[1] < 0){
		gameOver();
		clearInterval(intervalInstance);
		intervalInstance=null;
		return false;
	}
	if(lastPos[0] == preyPosition[0] && lastPos[1]==preyPosition[1]){
		snakeCell.splice(0,0,popCell);
		placePrey();
		score++;
		$(".score span#score-val").text(score);
	}
	return true;
}
var isAlready = function(x,y,cell){
	for(var i=0;i<cell.length-1;i++){
		if(cell[i][0] == x && cell[i][1] == y){
			return true;
		}
	}
	return false;
}
var switchDirection = function(e){
	var last = snakeCell[snakeCell.length-1];
	var prev = snakeCell[snakeCell.length-2];
	if(e.key=="ArrowUp"){
		if(last[0] != prev[0]+1){
			direction="up";
		}
	}
	else if(e.key=="ArrowDown"){
		if(last[0] != prev[0]-1){
			direction="down";
		}
	}
	else if(e.key == "ArrowRight"){
		if(last[1] != prev[1]-1){
			direction="right";
		}
	}
	else if(e.key == "ArrowLeft"){
		if(last[1] != prev[1]+1){
			direction="left";
		}
	}
}
var playGame = function(){
	hideOverlay();
	if(isGameover){
		isGameover = false;
		
	}
	if(!isPaused){
		intialize();
		placePrey();

	}
	isPaused = false;
	render();
	intervalInstance = setInterval(moveSnake,100);
}
var hideOverlay = function(){
	$('.overlay').hide();
	$('.header').removeClass('hidden');
}
var showOverlay = function(){
	$('.overlay').show();
	$('.header').addClass('hidden');
}
var pauseGame = function(){
	isPaused = true;
	clearInterval(intervalInstance);
	showOverlay();
	$('.title h1').text("Game Paused");
	$(".highscore").hide();
}
var gameOver = function(){
	showOverlay();
	isGameover = true;
	$("#play").addClass("replay")
	$(".highscore").show();
	$('.title h1').text("Game Over");
	$(".highscore #score-title").text("Your score : ");
	$(".highscore #highscore-val").text(score);
	if(score>highscore){
		$('.new-high-score').removeClass('hidden');
		localStorage.setItem("snake-high",score);
	}

}
var intialize = function(){
	snakeCell = [[24,0],[24,1],[24,2]];
	direction = 'right';
	intervalInstance = null;
	score = 0;
	preyPosition = [];
	popCell = [];
	isPaused = false;
	$(".score span#score-val").text(score);
	$('.title h1').text("Snake");
	$(".highscore #score-title").text("High Score : ");
	$(".highscore #highscore-val").text(highscore);
	$("#play").removeClass("replay");
	$('.new-high-score').addClass('hidden');
	$(document).on('keydown',function(e){
		e.preventDefault();
	});
}
var fetchHighscore = function(){
	highscore = localStorage.getItem("snake-high")?parseInt(localStorage.getItem("snake-high")):0;
}
$(document).ready(function(){
	generateLayout();
	fetchHighscore();
	intialize();
	$(document).keydown(switchDirection);
	$("#play").click(playGame);
	$("#pause").click(pauseGame);	
});

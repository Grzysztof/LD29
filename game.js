//Made by Krzysztof Myjak during 29th Ludum Dare 25->28 April 2014
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
var currentGameState = 0;

var scale = {
	tile : 5,
	player: 4,
	
}
var tile_size = 8*scale.tile
var air_timer = 0;
var currentMap = 1;
var score = 0;
//****images****//
var img_player = new Image();
img_player.src = 'img/player.png';

var img_grass = new Image();
img_grass.src = 'img/grass.png';
var img_sand = new Image();
img_sand.src = 'img/sand.png';
var img_wall = new Image();
img_wall.src = 'img/wall.png';
var img_rock = new Image();
img_rock.src = 'img/rock.png';
var img_door = new Image();
img_door.src = 'img/door.png';
var img_air = new Image();
img_air.src = 'img/air.png';
var img_gold = new Image();
img_gold.src = 'img/gold.png';



var player = {
	X:0,
	Y:0,
	W:10,
	SW: 10*scale.player,
	H:10,
	SH:10*scale.player,
	dir: 0,
	air: 80,
	move : function(x,y){
		try{
		//console.log(player.air);
		if(map[player_y+y][player_x+x]===0){
			map[player_y][player_x] = 0;
			map[player_y+y][player_x+x] = 5;//move player
			player_y += y;
			player_x += x;
			
			//clear some fog...
			try{visitedMap[player_y][player_x] = 1;}catch(err){}
			try{visitedMap[player_y-1][player_x] = 1;}catch(err){}
			try{visitedMap[player_y+1][player_x] = 1;}catch(err){}
			try{visitedMap[player_y][player_x-1] = 1;}catch(err){}
			try{visitedMap[player_y][player_x+1] = 1;}catch(err){}
			try{visitedMap[player_y-1][player_x+1] = 1;}catch(err){}
			try{visitedMap[player_y+1][player_x+1] = 1;}catch(err){}
			try{visitedMap[player_y+1][player_x-1] = 1;}catch(err){}
			try{visitedMap[player_y-1][player_x-1] = 1;}catch(err){}
		}else if(map[player_y+y][player_x+x]===4){
			map = generateMap();//if on doors
			currentMap++;
		}else if(map[player_y+y][player_x+x]===6){
			player.air = 100;//if on air
			map[player_y+y][player_x+x]=0;
		}else if(map[player_y+y][player_x+x]===7){//gold
			score+=100;
			map[player_y+y][player_x+x]=0;
		}
		}catch(err){};
	},
	cut : function(){
		try{
			switch(player.dir){
				case 0:
					if(map[player_y][player_x+1]==1)map[player_y][player_x+1]=0;
				break;
				case 1:
					if(map[player_y][player_x-1]==1)map[player_y][player_x-1]=0;
				break;
				case 2:
					if(map[player_y-1][player_x]==1)map[player_y-1][player_x]=0;
				break;
				case 3:
					if(map[player_y+1][player_x]==1)map[player_y+1][player_x]=0;
				break;
			
			}//switch
		}catch(err){};
		}
	} 
	
var player_x = 0;
var player_y = 0;

var map = generateMap();
var visitedMap;

//****main loop****//

document.onkeydown = keydown;
document.onkeyup = keyup;

function keydown(event){
	if(currentGameState === 1){
	
		if(event.keyCode === 38){
		player.dir = 2;
		player.move(0,-1);
		
		}//move up
		if(event.keyCode === 40){
		player.dir = 3;
		player.move(0,1);//move up
		
		}
		if(event.keyCode === 39){
		player.dir = 0;
		player.move(1,0);//move up
		
		}
		if(event.keyCode === 37){
		player.dir = 1;
		player.move(-1,0);//move up
		
		}
		if(event.keyCode === 32)player.cut();//move up
		//console.log(event.keyCode);
	}//gamestate
	if(currentGameState === 0){
		if(event.keyCode === 32)currentGameState = 1;
		if(event.keyCode === 72)currentGameState = 3;
	}
	if(currentGameState === 2){
		if(event.keyCode === 32)currentGameState = 0;
	}
	if(currentGameState === 3){
		if(event.keyCode === 32)currentGameState = 1;
	}	
}
function keyup(event){
}

function mainLoop(){
	ctx.clearRect(0,0,canvas.width,canvas.height)
	ctx.fillstyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width,canvas.height)
	if(currentGameState === 0)state_menu();
	if(currentGameState === 1)state_game();
	if(currentGameState === 2)state_gameOver();
	if(currentGameState === 3)state_help();
	
	//drawMap();
}


//rest of the functions
function drawMap(){
	for(var y=0;y<map.length;y++){
	//draw sand and obstacles
		for(var x=0;x<map[y].length;x++){
			ctx.drawImage(img_sand,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
			switch(map[y][x]){
				case 1:
					ctx.drawImage(img_grass,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
				break;
				case 2:
					ctx.drawImage(img_wall,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
				break;
				case 3:
					ctx.drawImage(img_rock,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
				break;
				case 4:
					ctx.drawImage(img_door,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
				break;
				case 5:
					ctx.drawImage(img_player,10*player.dir,0,10,10,(x*player.SW),(y*player.SH),player.SW,player.SH);
				break;
				case 6:
					ctx.drawImage(img_air,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
				break;
				case 7:
					ctx.drawImage(img_gold,0,0,8,8,(x*tile_size),(y*tile_size),tile_size,tile_size);
				break;
			}//switch
			if(visitedMap[y][x] === 0)ctx.fillRect(x*40,y*40,40,40);
		}//x
	}//y
	
	//ctx.drawImage(img_grass,0,0,8,8,20,20,8*scale.tile,8*scale.tile);
}

function generateMap(){
//16x12
	var gen = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	];
	visitedMap = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	];
	
	for(var y=0;y<gen.length;y++){
		for(var x=0;x<gen[y].length;x++){
			var randomizer = Math.floor((Math.random()*42)+0);
			var block;
			var door = false;
			var player = false;
			var air = false;
			if(randomizer<16)block=1;//grass
			if(randomizer>15&&randomizer<20)block=2;//wall
			if(randomizer>19&&randomizer<23)block=3;//rock
			if(randomizer>22&&randomizer<25)block=7;//gold
			if(randomizer>24)block=0;
			gen[y][x] = block;
		}
	}
	//place doors and 3x3 clear area.
	if(!air){
		var ax = Math.floor((Math.random()*16)+0);
		var ay = Math.floor((Math.random()*12)+0);
		gen[ay][ax] = 6;
	}
	
	if(!door){
		var gx = Math.floor((Math.random()*16)+0);
		var gy = Math.floor((Math.random()*12)+0);
		gen[gy][gx] = 4;
		try{gen[gy-1][gx] = 0;}catch(err){}
		try{gen[gy+1][gx] = 0;}catch(err){}
		try{gen[gy][gx-1] = 0;}catch(err){}
		try{gen[gy][gx+1] = 0;}catch(err){}
		try{gen[gy-1][gx+1] = 0;}catch(err){}
		try{gen[gy+1][gx+1] = 0;}catch(err){}
		try{gen[gy+1][gx-1] = 0;}catch(err){}
		try{gen[gy-1][gx-1] = 0;}catch(err){}
	}
	
	
	//place player
	if(!player){
		var gx = Math.floor((Math.random()*16)+0);
		var gy = Math.floor((Math.random()*12)+0);
		//console.log(gx+'x'+gy);
		gen[gy][gx] = 5;
		try{gen[gy-1][gx] = 0;}catch(err){}
		try{gen[gy+1][gx] = 0;}catch(err){}
		try{gen[gy][gx-1] = 0;}catch(err){}
		try{gen[gy][gx+1] = 0;}catch(err){}
		try{gen[gy-1][gx+1] = 0;}catch(err){}
		try{gen[gy+1][gx+1] = 0;}catch(err){}
		try{gen[gy+1][gx-1] = 0;}catch(err){}
		try{gen[gy-1][gx-1] = 0;}catch(err){}
		
		player_x = gx;
		player_y = gy;
		
		//clear some fog...
			try{visitedMap[player_y][player_x] = 1;}catch(err){}
			try{visitedMap[player_y-1][player_x] = 1;}catch(err){}
			try{visitedMap[player_y+1][player_x] = 1;}catch(err){}
			try{visitedMap[player_y][player_x-1] = 1;}catch(err){}
			try{visitedMap[player_y][player_x+1] = 1;}catch(err){}
			try{visitedMap[player_y-1][player_x+1] = 1;}catch(err){}
			try{visitedMap[player_y+1][player_x+1] = 1;}catch(err){}
			try{visitedMap[player_y+1][player_x-1] = 1;}catch(err){}
			try{visitedMap[player_y-1][player_x-1] = 1;}catch(err){}
	
	}
	
	return gen
}
function drawGUI(){
	ctx.fillStyle = '#FFFFFF'
	ctx.font="33px Trade Winds";
	ctx.fillText("SCORE: "+score+"    Air: "+player.air+"%    Level: "+currentMap,10,40);
	ctx.fillStyle = '#000000';
}

function state_game(){
	drawMap();
	drawGUI();
	if(player.air<1)currentGameState=2;
	air_timer++;
	if(air_timer>39){
		player.air--;
		air_timer = 0;
	}
}
function state_menu(){
	player.air = 80;
	score = 0;
	currentMap = 1;
	map = generateMap();
	ctx.fillStyle = '#FFFFFF'
	ctx.font="60px Trade Winds";
	ctx.fillText("Gold Diver",150,100);
	ctx.font="40px Trade Winds";
	ctx.fillText("Press 'SPACE' TO START!",20,canvas.height/2);
	ctx.fillText("Or 'H' for some Help!",20,(canvas.height/2)+40);
	ctx.font="25px Trade Winds";
	ctx.fillText("Made by Krzysztof 'RocketDuke' Myjak for LD29",10,440);
	ctx.fillStyle = '#000000';
}
function state_gameOver(){
	ctx.fillStyle = '#FFFFFF'
	ctx.font="40px Trade Winds";
	ctx.fillText("You ran out of air!",20,canvas.height/2);
	ctx.fillText("Your score: "+score,50,(canvas.height/2)+40);
	ctx.fillText("Press 'SPACE' to start again...",20,(canvas.height/2)+80);
	ctx.fillStyle = '#000000';
}
function state_help(){
	ctx.fillStyle = '#FFFFFF'
	ctx.font="25px Trade Winds";
	ctx.fillText("Use arrow keys to move your diver,",40,40);
	ctx.fillText("Cut",40,80);ctx.drawImage(img_grass,0,0,8,8,100,45,tile_size,tile_size);
	ctx.fillText("using SPACEBAR",150,80);
	ctx.fillText("Collect as many ",40,120);ctx.drawImage(img_gold,0,0,8,8,270,85,tile_size,tile_size); ctx.fillText("as you can!",320,120);
	ctx.fillText("But be fast you have only one air tank...",40,160);
	ctx.fillText("If you find some spare ones (",40,200);ctx.drawImage(img_air,0,0,8,8,410,170,tile_size,tile_size);ctx.fillText(")...",460,200);
	ctx.fillText("...use them!",410,240);
	ctx.fillText("Find ",40,280);ctx.drawImage(img_door,0,0,8,8,110,245,tile_size,tile_size);ctx.fillText("to go deeper ...",160,280);
	ctx.fillText("Made by Krzysztof 'RocketDuke' Myjak for LD29",10,400);
	ctx.fillText("Press 'SPACEBAR' to start...",150,450);
	ctx.fillStyle = '#000000';
}

//****core****//
var engine = {
	now: new Date().getTime(),
	timeStamp :0 ,
	update: function(){
		//console.log(this)
		engine.now = new Date().getTime();
		if((engine.now-engine.timeStamp)>14){
			mainLoop();
			engine.timeStamp = engine.now;
		}
		requestAnimationFrame(engine.update);
	},	
}
requestAnimationFrame(engine.update);



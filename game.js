//Made by Krzysztof Myjak during 29th Ludum Dare 25->28 April 2014
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var scale = {
	tile : 5,
	player: 5,
	
}

//****images****//
var img_player = new Image();
img_player.src = 'img/submarine.png';

var img_grass = new Image();
img_grass.src = 'img/grass.png';
var img_sand = new Image();
img_sand.src = 'img/sand.png';
var img_wall = new Image();
img_wall.src = 'img/wall.png';



//****main loop****//
function mainLoop(){
	ctx.clearRect(0,0,canvas.width,canvas.height)
	drawMap();
	ctx.drawImage(img_player,0,0,44,33,20,90,44*scale.player,22*scale.player);
}
function drawMap(){
	for(var i=0;i<20;i++){
		ctx.drawImage(img_grass,0,0,8,8,i*40,0,8*scale.tile,8*scale.tile);
	}
	for(var i=0;i<20;i++){
		ctx.drawImage(img_wall,0,0,8,8,i*40,1*scale.tile*8,8*scale.tile,8*scale.tile);
	}
	for(var i=0;i<20;i++){
		ctx.drawImage(img_sand,0,0,8,8,i*40,2*scale.tile*8,8*scale.tile,8*scale.tile);
	}
	for(var i=0;i<20;i++){
		ctx.drawImage(img_sand,0,0,8,8,i*40,3*scale.tile*8,8*scale.tile,8*scale.tile);
	}
	//ctx.drawImage(img_grass,0,0,8,8,20,20,8*scale.tile,8*scale.tile);
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



function Gameloop(){
	//
	//Clear what you have
	//
	context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
	
	//
	//Get player input
	//
	if(keyState[40]){ //down

	}
	if(keyState[38]){ //up

	}
	if(keyState[37]){ //left

	}
	if(keyState[39]){ //rite

	}

    //
    //Do all yer calculationings
    //
	
	//
	//Draw shit
	//
	
	mouseCheck();
	
	for(var y = 0; y < rawMap.length; y++){
		for(var x = 0; x < rawMap[y].length; x++){
			xc = xOffset + x*hexDim + hexDim*(y%2)/2;
			yc = yOffset + y*hexDim*13/18;
			var l = rawMap[y][x];
			if(l.Land){
				var hexImage = l.Owner.Hex;
				if(l.Selected)
					DrawImage(Images.selected, xc, yc, hexDim, hexDim);
				else	
					DrawImage(hexImage, xc, yc, hexDim, hexDim);
				
				/*DrawImage(Images.resources[0][l.generateWool], xc, yc, hexDim, hexDim);
				DrawImage(Images.resources[1][l.generateRock], xc, yc, hexDim, hexDim);
				DrawImage(Images.resources[2][l.generateIron], xc, yc, hexDim, hexDim);
				DrawImage(Images.resources[3][l.generateLumber], xc, yc, hexDim, hexDim);*/
			}	
		}
	}
	generateMenu();
	//
	//Restart your gameloop for more frames
	//
    setTimeout(Gameloop,1000/60);
}
context.font="20px Georgia";


var xMapLimit = 12;
var yMapLimit = 13;
var xOffset = 10;
var yOffset = 10;
var hexDim = 80;

var rawMap = [];
function generateLands(){
	var blobAmount = 15;
	var blobList = [];
	//Generate blobs in bounds of level
	for(var n = 0; n < blobAmount; n++){
		var xx = Math.floor(Math.random()*(xMapLimit+1));
		var yy = Math.floor(Math.random()*(yMapLimit+1));
		
		//Check if blob doesnt already exist.
		var canAdd = true;
		for(var m = 0; m < blobList.Length; m++){
			if(blobList[m].X == xx && blobList[m].Y == yy)
				canAdd = false;
		}
		if(canAdd)
			blobList.push(new Point(xx,yy));
		else
			n--;
	}
	console.log(blobList.length);
	//Iterate over all coordinates and add a space based on rand over distance to nearest blob.
	for(var y = 0; y < yMapLimit; y++){
		rawMap[y] = [];
		for(var x = 0; x < xMapLimit; x++){
			var rangeX = 99;
			var rangeY = 99;
			//Get closest blob
			for(var z = 0; z < blobList.length; z++)
			{
				var xx = Math.abs(blobList[z].X-x);
				var yy = Math.abs(blobList[z].Y-y);
				if(xx*xx+yy*yy < rangeX*rangeX+rangeY*rangeY){
					rangeX = xx;
					rangeY = yy;
				}
			}
			var d = Math.sqrt(Math.pow(rangeX,2)+Math.pow(rangeY,2));
			if(Math.random()<3.5-Math.pow(1.69,d))
				rawMap[y][x] = new LandSpace(x,y,true);
			else
				rawMap[y][x] = new LandSpace(x,y,false);
		}
			
	}
	
}

function divideLands(){
	var landCount = rawMap.length*rawMap[0].length;
	//Create list to pick the numbers from so they dont have duplicates.
	var selectList = [];
	for(i = 0; i < landCount; i++)
		selectList.push(i);
	
	var divideCount = landCount/playerList.length;
	for(i = 0; i < playerList.length; i++){
		var counter = divideCount;
		//Assign floor tiles to players.
		while(counter > 0){
			var rand = Math.floor(Math.random()*selectList.length);
			
			var select = selectList[rand];
			var selectCol = select % xMapLimit;
			var selectRow = Math.floor(select/xMapLimit);
			rawMap[selectRow][selectCol].Owner = playerList[i];
			selectList.splice(rand, 1);
			counter--;
		}
	}
}

var playerList = [];
function createPlayers(amount){
	for(i = 0; i < amount; i++)
		playerList.push(new Player(i, i));
}

function Player(name, i){
	this.Name = name;
	this.Hex = Images.hexagons[i];
}

/*function generateResources(){
	for(var y = 0; y < yMapLimit; y++){
		for(var x = 0; x < xMapLimit; x++){
			if(rawMap[y][x].Land){
				generateResourcesF(y,x,1);
				generateResourcesF(y,x,1);
				generateResourcesF(y,x,2);
				generateResourcesF(y,x,3);
				generateResourcesF(y,x,5);
				generateResourcesF(y,x,8);
				generateResourcesF(y,x,13);
			}		
		}
	}
}
function generateResourcesF(y,x,n){
	var rand = Math.random();
	if(rand<0.25/n)
		rawMap[y][x].generateWool+=1;
	else if(rand<0.50/n)
		rawMap[y][x].generateIron+=1;
	else if(rand<0.75/n)
		rawMap[y][x].generateRock+=1;
	else if(rand<1/n)
		rawMap[y][x].generateLumber+=1;
}*/
	


function LandSpace(x, y, l){
	this.Selected = false;
	this.X = x;
	this.Y = y;
	this.Land = l;
	this.Owner;
	this.Dice = 1;
	this.Attack = function(other){
		if(this.Dice <= 1){
			alert("Not enough dice to attack that tile.");
			return;
		}
	}
	/*this.Rock = 0;
	this.Lumber = 0;
	this.Iron = 0;
	this.Wool = 0;
	this.generateWool = 0;
	this.generateIron = 0;
	this.generateRock = 0;
	this.generateLumber = 0;*/
}
function Point(x, y){
	this.X = x;
	this.Y = y;
}
var oldButtonIndex = -1;
function mouseCheck(){
	if(Mouse.OnClick){
		Mouse.OnClick = false;
		//Check for menu hitbox (buttons)
		var menuX = xMapLimit*hexDim + hexDim/2 + xOffset + 10
		var menuY = 0;
		if(Mouse.X > menuX){
			for(i = 0; i < buttonList.length; i++){
				var button = buttonList[i];
				if(Mouse.X > button.X && Mouse.Y > button.Y && Mouse.X < canvas.width && Mouse.Y < button.Y + button.Height){
					if(oldButtonIndex != -1)
						buttonList[oldButtonIndex].Selected = false;
					button.Selected = true;
					oldButtonIndex = i;
				}
			}
		}
	
		//Check for hexagon hitbox
		var collect = [];
		//Check which hexagon the mouse is over and when clicked select this hexagon.
		var yMap = Math.floor((Mouse.Y-yOffset)/((13*hexDim)/18));
		var yCoord = yMap*(13*hexDim)/18+hexDim/2+yOffset;
		var xMap = Math.floor((Mouse.X-xOffset-hexDim*(yMap%2)/2)/hexDim);
		var xCoord = xMap*hexDim+hexDim/2+hexDim*(yMap%2)/2+xOffset;
		collect.push([yMap,yCoord,xMap,xCoord]);
		yMap-=1
		yCoord = yMap*(13*hexDim)/18+hexDim/2+yOffset;
		for(var x = 0; x < 3; x++){
			xMap = Math.floor((Mouse.X-xOffset-hexDim*(yMap%2)/2)/hexDim);
			xCoord = xMap*hexDim+hexDim/2+hexDim*(yMap%2)/2+xOffset;
			collect.push([yMap,yCoord,xMap,xCoord]);
		}
		for(var n = 0; n < collect.length; n++){
			if(collect[n][0] >= 0 && collect[n][0] < yMapLimit && collect[n][2] >= 0&& collect[n][2] < xMapLimit && Math.pow(collect[n][3] - Mouse.X,2)+Math.pow(collect[n][1] - Mouse.Y,2) < Math.pow(hexDim/2,2)&& rawMap[collect[n][0]][collect[n][2]].Land)
			{	
				if(oldSelected.X >= 0 && oldSelected.Y >=0)
					rawMap[oldSelected.X][oldSelected.Y].Selected=false;
				rawMap[collect[n][0]][collect[n][2]].Selected=true;
				oldSelected.X = collect[n][0];
				oldSelected.Y = collect[n][2];
				break;
			}
		}
	}
}
var oldSelected = new Point(-1,-1);

function generateMenu(){
	var menuX = xMapLimit*hexDim + hexDim/2 + xOffset + 10
	var menuY = 0;
	context.fillStyle="#999999";
	context.fillRect(menuX, menuY, canvas.width-menuX, canvas.height-menuY);
	
	//Statistics about the selected field
	context.fillStyle="#000000";
	context.font="20px Georgia";
	if(oldSelected.X == -1){ //None selected yet
		context.fillText("None selected.", menuX + 5, menuY + 40);
		return;
	} 
	else{
		context.fillText("Stats: ", menuX + 5, menuY + 40);
		var dice = rawMap[oldSelected.X][oldSelected.Y].Dice;
		context.fillText("Dice amount: "+dice, menuX + 5, menuY + 65)
	}
	//Buttons
	for(i = 0; i < buttonList.length; i++){
		if(buttonList[i].Selected)
			context.fillStyle="#88AA88";
		else
			context.fillStyle="#AAAAAA";
		context.fillRect(buttonList[i].X, buttonList[i].Y, canvas.width-menuX, 40);
		context.fillStyle="#000000";
		context.fillText(buttonList[i].Title, buttonList[i].X + 5, buttonList[i].Y+25);
	}
}
function Button(title, action){
	var tempX = xMapLimit*hexDim + hexDim/2 + xOffset + 10;
	var tempY = canvas.height/2 + buttonList.length*40
	this.X = tempX;
	this.Y = tempY;
	this.Height = 40;
	this.Title = title;
	this.Selected = false;
	this.Action = action;
}
var buttonList = [];
function initButtons(){
	buttonList.push(new Button("Capture", "func"));
	buttonList.push(new Button("Something", "func"));
}
function initialize(){
	PreloadImages();
	generateLands();
	createPlayers(2);
	divideLands();
	initButtons();
	//generateResources();
}
initialize();
//
//Key input stuff
//
var keyState = [];
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);
var keyStateOnHit = [];
window.addEventListener('keydown',function(e){
    keyStateOnHit[e.keyCode || e.which] = true;
},true);

//
//Preloading images for less traffic
//
function PreloadImages(){
	Images.grass = new Image();
	Images.grass.src = "grass.png";
	Images.hexagons=[];
	for(var i = 0; i < 2; i++){
		Images.hexagons[i]= new Image();
		Images.hexagons[i].src = "hex"+i+".png";
	}
	Images.selected = new Image();
	Images.selected.src = "sel.png";
	/*Images.resources=[];
	for(var i = 0; i < 4; i++){
		Images.resources[i]=[];
		for(var j = 0; j < 9; j++){
			Images.resources[i][j] = new Image();
			Images.resources[i][j].src = i+"-"+j+".png";
		}
	}*/
}
	
//
//Some tiny functions I find useful
//
function SetTimer(name,timer){ //Time is (timer*(1000/60))

	//Make a new object for the new timer, created by name input
	if(setTimerArray.name == null){
		setTimerArray.name = 0;
	}
	else{
		setTimerArray.name++;
	}
	
	//If the timer has been on for long enough it will return true and reset itself.
	if(setTimerArray.name > timer){
		setTimerArray.name = 0;
		return true;
	}
	else{
		return false;
	}
	
}
function DrawImage(source,y,x,width,height){
    context.drawImage(source,y,x,width,height);
}

//
//Mouse input stuff
//
window.addEventListener('mousedown',startGettingMouseLocation,true);
window.addEventListener('mousemove',getMouseLocation,true);
window.addEventListener('mouseup',stopGettingMouseLocation,true);
function stopGettingMouseLocation(e){
    if(canContinueLoop){
        canContinueLoop = null;
        Mouse.Click = false;
		Mouse.OnClick = false;
    }
}
function startGettingMouseLocation(e){
    if (!canContinueLoop){
        canContinueLoop = true;
        Mouse.X = e.clientX - canvas.getBoundingClientRect().left;
        Mouse.Y = e.clientY - canvas.getBoundingClientRect().top;
		if(!Mouse.Click)
			Mouse.OnClick = true;
		
        Mouse.Click = true;
		
    }
}
function getMouseLocation(e){
    if(canContinueLoop){
        Mouse.X = e.clientX - canvas.getBoundingClientRect().left;
		Mouse.Y = e.clientY - canvas.getBoundingClientRect().top;
    }
}




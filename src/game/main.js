var Main = function (game) {

};

Main.prototype = {

	create: function() {

        //alert("In Creata...");
		var me = this;

        me.gridWidth = 8;
        me.gridHeight = 8;
        me.gridMap = {}; 
        me.tileGrid = [];
        //Load Level Data
        me.loadLevelData();
    
		me.game.stage.backgroundColor = "FEA501";

		me.guessing = false;
		me.currentWord = [];
		me.correctWords = [];

		//Keep track of the users score
		me.score = 0;
		me.scoreBuffer = 0;

		//Keep track fo the round time
		me.remainingTime = 6000;
		me.fullTime = 6000;

		//What colours will be used for our tiles?
		me.tileColors = [
            "#ffffff",
            "#00ffff",
            "#00ced1",
            "#00bfff",
            "#00ff00",
            "#00fa9a",
            "#00ff7f",
            "#32cd32",
            "#3cb371",
            "#40e0d0",
            "#48d1cc",
            "#4b0082",
            "#778899",
            "#7cfc00",
            "#7fffd4",
            "#7fff00",
            "#800080",
            "#87cefa",
            "#87ceeb",
            "#8a2be2",
            "#8b008b",
            "#9400d3",
            "#98fb98",
            "#9932cc",
            "#9acd32",
            "#adff2f",
            "#c71585",
            "#dc143c",
            "#fa8072",
            "#ff7f50",
            "#ff1493",
            "#ff00ff",
            "#ffd700",
            "#ff69b4",
            "#ff00ff",
            "#ff4500",
            "#ff6347",
            "#ffff00"
		];

        me.activeColor = me.tileColors[0];
        //20% of Screenspace for Top and Bottom menu
        me.menuBuffer = 0.35
		//Set the width and height for the tiles
		me.tileHeight = (me.game.height*(1-me.menuBuffer))/me.gridHeight;
        //me.tileWidth = (me.game.width*(1-me.menuBuffer))/me.gridWidth;
		me.tileWidth = me.tileHeight

        //alert(me.tileWidth+ "...." +me.tileHeight);
		//A buffer for how much of the tile activates a select
		me.selectBuffer = me.tileWidth / 6;

		//This will hold all of the tile sprites
		me.tiles = me.game.add.group();

		//Keep a reference to the total grid width and height
		me.boardWidth = me.gridWidth * me.tileWidth;
		me.boardHeight = me.gridHeight  * me.tileHeight;

		//We want to keep a buffer on the left and top so that the grid
		//can be centered
		me.leftBuffer = (me.game.width - me.boardWidth) / 2;
		me.topBuffer = (me.game.height - me.boardHeight) / 2;

		//Create a random data generator to use later
		var seed = Date.now();
		me.random = new Phaser.RandomDataGenerator([seed]);
        
        //alert("In Main Create...");
        //	Our background
        //me.game.add.image(0, 0, 'background');

        var topBar = game.add.graphics();
        topBar.beginFill(0x000000, 0.2);
        topBar.drawRect(0, 0, me.game.width, (me.game.height*0.05));
        
		//Set up some initial tiles and the score label
		me.initTiles();
		me.createScore();
		me.createTimer();

        var bottomBar = game.add.graphics();
        bottomBar.beginFill(0xcc7a00);
        bottomBar.drawRect(0, (me.game.height-(me.game.height*0.18)), me.game.width, (me.game.height*0.18));
        
        me.addWords();
        
		me.game.input.onDown.add(function(){
            me.guessing = true;
            me.setActiveColor();
        }, me);
		me.game.input.onUp.add(function(){
            me.guessing = false;
            me.activeColor = me.tileColors[0];
        }, me);

		me.gameTimer = game.time.events.loop(100, function(){
			me.updateTimer();
		});
	},

	update: function() {

		var me = this;

		if(me.scoreBuffer > 0){
			me.incrementScore();
			me.scoreBuffer--;
		}

		if(me.remainingTime < 1){
			me.game.state.restart();
		}

		if(me.guessing){

			//Get the location of where the pointer is currently
			var hoverX = me.game.input.x;
			var hoverY = me.game.input.y;

			//Figure out what position on the grid that translates to
			var hoverPosX = Math.floor((hoverX - me.leftBuffer)/me.tileWidth);
			var hoverPosY = Math.floor((hoverY - me.topBuffer)/me.tileHeight);

			//Check that we are within the game bounds
			if(hoverPosX >= 0 && hoverPosX < me.gridHeight && hoverPosY >= 0 && hoverPosY < me.gridWidth){

				//Grab the tile being hovered over
				var hoverTile = me.tileGrid[hoverPosX][hoverPosY];
                //alert(hoverTile);
				//Figure out the bounds of the tile
				var tileLeftPosition = me.leftBuffer + (hoverPosX * me.tileWidth);
				var tileRightPosition = me.leftBuffer + (hoverPosX * me.tileWidth) + me.tileWidth;
				var tileTopPosition = me.topBuffer + (hoverPosY * me.tileHeight);
				var tileBottomPosition = me.topBuffer + (hoverPosY * me.tileHeight) + me.tileHeight;

				//If the player is hovering over the tile set it to be active. The buffer is provided here so that the tile is only selected
				//if the player is hovering near the center of the tile
				if(!hoverTile.isActive && hoverX > tileLeftPosition + me.selectBuffer && hoverX < tileRightPosition - me.selectBuffer 
					&& hoverY > tileTopPosition + me.selectBuffer && hoverY < tileBottomPosition - me.selectBuffer){

					//Set the tile to be active
					hoverTile.isActive = true;
                    console.log('Hi...');
					if(hoverTile.TInstance.ctx.fillStyle == me.activeColor)
                        alert(hoverTile.TInstance.ctx.fillStyle);

					//Push this tile into the current word that is being built
					me.currentWord.push(hoverTile);
                    
                    hoverTile.TInstance.clear();
                    me.resetTile(hoverTile.tileLetter, me.activeColor, hoverTile.TInstance, hoverX, hoverY);
				}

			}

		}
		else {

			if(me.currentWord.length > 0){

				var guessedWord = '';
                var correctGuess = false;
				//Build a string out of all of the active tiles
				for(var i = 0; i < me.currentWord.length; i++){
					guessedWord += me.currentWord[i].tileLetter;
					me.currentWord[i].isActive = false;
				}

                var levelJson = game.cache.getJSON('levelData');
                //alert("LevelJson " + levelJson);
                //alert("Grid Width " + levelJson.Grid_Width);
                //alert("Grid Height " + levelJson.Grid_Height);
                me.gridWidth = levelJson.Grid_Width;
                me.gridHeight = levelJson.Grid_Height;

                //alert(levelJson.Levels.length);
                //alert(levelJson.Levels[0]);
                for(levelIndex=0; levelIndex<levelJson.Levels.length; levelIndex++){
                    wordData = levelJson.Levels[levelIndex];
                    //alert("Word : " + wordData['Word'] + " Guessed Word : " + guessedWord);
				    //Check to see if this word exists in our dictionary
                    if(wordData['Word'] == guessedWord){
                        //alert("Correct !!!");
                        //Check to see that the word has not already been guessed
                        if(me.correctWords.indexOf(guessedWord) == -1){
                            me.scoreBuffer += 10 * guessedWord.length;
                            //Add this word to the already guessed word
                            me.correctWords.push(guessedWord);
                        }
                        
                        if(levelJson.Levels.length == me.correctWords.length){
                            game.state.start("GameOver");
                        }
                        correctGuess = true;
                        break;
                    }
                }

                if(!correctGuess) {
                    for(var i = 0; i < me.currentWord.length; i++){
                        //me.currentWord[i].isActive = false;
                        me.currentWord[i].TInstance.clear();
                        me.resetTile(me.currentWord[i].tileLetter, '#ffffff', me.currentWord[i].TInstance, hoverX, hoverY);                            
                    }                        
                    //console.log("incorrect!");
                }                    
                
                //Reset the current word
				me.currentWord = [];                
			}

		}

	},

    setActiveColor: function(){
        var me = this;
        me.activeColor = me.tileColors[me.random.integerInRange(0, me.tileColors.length - 1)];  
    },
    
	initTiles: function(){

		var me = this;
        //tileGrid[me.gridWidth] = [];
		//Loop through each column in the grid
		for(var i = 0; i < me.gridWidth; i++){
            me.tileGrid[i] = [];    
			//Loop through each position in a specific column, starting from the top
			for(var j = 0; j < me.gridHeight; j++){

				//Add the tile to the game at this grid position
				var tile = me.addTile(i, j);

				//Keep a track of the tiles position in our tileGrid
				me.tileGrid[i][j] = tile;

			}
		}

	},

	addTile: function(x, y){
        //alert("In Main addTile...");
		var me = this;
        var key = '('+x+', '+y+')';
        //alert(key);
		var TLetters = game.cache.getJSON('TLetters');
        //alert("TLetters " + TLetters);
        var tileLetter = '';
        //Choose a random tile to add
        if(me.gridMap[key] != undefined || me.gridMap[key] != null){
            tileLetter = me.gridMap[key];
        }else{
            tileLetter = TLetters['Tamil_Letters'][me.random.integerInRange(0, 246)];
        }
		//alert('Tile Letter: ' + tileLetter);
		var tileColor = me.tileColors[0];
		var tileToAdd = me.createTile(tileLetter, tileColor);	
        //alert(tileToAdd.ctx);
		//Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
		var tile = me.tiles.create(me.leftBuffer + (x * me.tileWidth) + me.tileWidth / 2, 0, tileToAdd);

		//Animate the tile into the correct vertical position
		me.game.add.tween(tile).to({y:me.topBuffer + (y*me.tileHeight+(me.tileHeight/4))}, 800, Phaser.Easing.Linear.In, true)

		//Set the tiles anchor point to the center
		tile.anchor.setTo(0.5, 0.5);

		//Keep track of the type of tile that was added
		tile.tileLetter = tileLetter;
        tile.TInstance = tileToAdd;
        //alert(tile.TInstance.ctx);
		return tile;

	},

	createTile: function(letter, color){

		var me = this;

		var tile = me.game.add.bitmapData(me.tileWidth, me.tileHeight);

		tile.ctx.rect(5, 5, me.tileWidth - 5, me.tileHeight - 5);
		tile.ctx.fillStyle = color;
		tile.ctx.fill();

		tile.ctx.font = '12px Arial';
		tile.ctx.textAlign = 'center';
		tile.ctx.textBaseline = 'middle';
		tile.ctx.fillStyle = '#fff';
		if(color == '#ffffff'){
			tile.ctx.fillStyle = '#000000';
		}
		tile.ctx.fillText(letter, me.tileWidth / 2, me.tileHeight / 2);

		return tile;

	},
    
	resetTile: function(letter, color, tile, posX, posY){

		var me = this;

		//var tile = me.game.add.bitmapData(me.tileWidth, me.tileHeight);

		tile.ctx.rect(posX, posY, me.tileWidth - 5, me.tileHeight - 5);
		tile.ctx.fillStyle = color;
		tile.ctx.fill();

		tile.ctx.font = '12px Arial';
		tile.ctx.textAlign = 'center';
		tile.ctx.textBaseline = 'middle';
		tile.ctx.fillStyle = '#fff';
		if(color == '#ffffff'){
			tile.ctx.fillStyle = '#000000';
		}
		tile.ctx.fillText(letter, me.tileWidth / 2, me.tileHeight / 2);

		return tile;

	},
    
	createScore: function(){

		var me = this;
		var scoreFont = "15px Arial";
        me.scoreText = me.game.add.text((me.game.width-125), (me.game.height*0.01), "Score:", {font: scoreFont, fill: "#ffffff"}); 
		me.scoreLabel = me.game.add.text((me.game.width-75), (me.game.height*0.01), "0", {font: scoreFont, fill: "#ffffff"}); 
		me.scoreLabel.anchor.setTo(0.5, 0);
		me.scoreLabel.align = 'center';

	},

	incrementScore: function(){

		var me = this;

		me.score += 1;   
		me.scoreLabel.text = me.score; 		

	},

	createTimer: function(){

		var me = this;

		me.timeBar = me.game.add.bitmapData(me.game.width, 30);

		//make white and have a blue background
		me.timeBar.ctx.rect(0, 0, me.game.width, 10);
		me.timeBar.ctx.fillStyle = '#ffffff';
		me.timeBar.ctx.fill();

		me.timeBar = me.game.add.sprite(0, (me.game.height*0.05), me.timeBar);
		//Set the tiles anchor point to the center
		//me.timeBar.anchor.setTo(0.5, 0.5);
        
		me.timeBar.cropEnabled = true;

	},

	updateTimer: function(){

		var me = this;

		me.remainingTime -= 10;

		var cropRect = new Phaser.Rectangle(0, 0, (me.remainingTime / me.fullTime) * me.game.width, me.timeBar.height);
		me.timeBar.crop(cropRect);

	},
    
    addWords: function(){
        var me = this;
        var group = me.game.add.group();
        var levelJson = game.cache.getJSON('levelData');
        var centerX = me.game.world.centerX;
        //var multiplierX = 0;
        //var multiplierY = 0;
        var allWords = '';
        for(levelIndex=0; levelIndex<levelJson.Levels.length; levelIndex++){
            wordData = levelJson.Levels[levelIndex];            
            allWords = allWords + wordData['Word'] + "\t\t\t\t";
        }
        var style = { font: "15px Bold Arial", fill: "#fff", wordWrap: true, wordWrapWidth: 450, boundsAlignH:"center", boundsAlignV: "middle" };
        text = game.add.text(0, 0, allWords, style);
        //(me.game.height-(me.game.height*0.15))
        text.setTextBounds(0, 225, me.game.width, me.game.height);
    },

    loadLevelData: function(){
        //alert("In Main LoadLevelData..." + game.cache.getJSON('levelData'));
        var me = this;
        var levelJson = game.cache.getJSON('levelData');
        //alert("LevelJson " + levelJson);
        //alert("Grid Width " + levelJson.Grid_Width);
        //alert("Grid Height " + levelJson.Grid_Height);
        me.gridWidth = levelJson.Grid_Width;
        me.gridHeight = levelJson.Grid_Height;
        
        //alert(levelJson.Levels.length);
        //alert(levelJson.Levels[0]);
        for(levelIndex=0; levelIndex<levelJson.Levels.length; levelIndex++){
            wordData = levelJson.Levels[levelIndex];
            ////alert(wordData['CellName']);
            ////alert(wordData['CellName'].length);
            for(index=0; index<wordData['CellName'].length; index++){
                console.log(me.gridMap[wordData['CellName'][index]]);
                if(me.gridMap[wordData['CellName'][index]] == 'undefined' || me.gridMap[wordData['CellName'][index]] == null){
                    me.gridMap[wordData['CellName'][index]] = wordData['CellValue'][index];    
                }else{
                    console.log('Warning OldValue: ' + me.gridMap[wordData['CellName'][index]] + 'NewValue: ' + wordData['CellValue'][index]);
                }
            }
        }
    }    
    
};
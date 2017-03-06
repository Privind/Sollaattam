var Preload = function(game){};

Preload.prototype = {

	init: function (){
        //alert("In Preload Init...");
		var me = this;

		var style = {
			font: "32px Arial",
			fill: "#ffffff",
			align: "center" 
		};

		this.text = this.add.text(me.game.world.centerX, me.game.world.centerY, "Loading: 0%", style);
		this.text.anchor.x = 0.5;
	},

	preload: function(){ 
        //alert("In preload function...");
		game.load.json('TLetters', 'assets/GameData/Tamil_Letters.json');
        ////alert("TLetters..." + this.game.cache.getJSON('TLetters'));
	},

	fileLoaded: function(progress){
		this.text.text = "Loading: " + progress + "%";
	},

	create: function(){
		this.game.state.start("MenuManager");
	}

}
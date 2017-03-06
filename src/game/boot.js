var Boot = function(game){

};
  
Boot.prototype = {

	preload: function(){

	},
	
  	create: function(){
		//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;        
        //this.game.scale.aspectRatio = 1;
        //alert("In Boot...");
		this.game.state.start("Preload");
	}
}
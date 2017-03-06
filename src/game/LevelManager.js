var LevelManager = function(game){};

LevelManager.prototype = {

	preload: function(){
        var nextLevel;
        var levelStr = localStorage.getItem("gameType").split('_');
        var key='';
        for(index=0;index<levelStr.length;index++){
            //alert(levelStr[index]);
            key += levelStr[index].substr(0,1);
        }
        //alert(key);
        if(localStorage.getItem('current_level') != null){
            nextLevel = current_level++;
        }else{
            nextLevel = 1;
        }
        
        if(nextLevel >10 && nextLevel < 100){
            nextLevel = '0'+nextLevel;   
        }else if(nextLevel < 10){
            nextLevel = '00'+nextLevel;
        }
        var filePath = 'assets/Levels/'+key+'Level_'+nextLevel+'.json';
        //alert(nextLevel);
        //alert(filePath);
        game.load.json('levelData', filePath);
        
	},
    
    create: function(){
        //alert(game.cache.checkJSONKey('levelData'));
        //alert(game.cache.checkJSONKey('TLetters'));
        //alert("loading main");
		game.state.start("Main");    
    }

}
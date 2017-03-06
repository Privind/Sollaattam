var MenuManager = function(game){};

MenuManager.prototype = {
    //var button;    
	preload: function(){
        var me = this;
        //me.slickUI = me.game.plugins.add(Phaser.Plugin.SlickUI);
        //me.slickUI.load('assets/Graphics/ui/kenney/kenney.json');
        //game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        game.load.json('labels', 'assets/GameData/Labels.json');
        game.load.image('background', 'assets/Graphics/Background_Yellow.jpg');
        game.load.atlas('button', 'assets/Graphics/ui/kenney/images/button_sprite.png', 'assets/Graphics/ui/kenney/images/button_sprite.json');

	},

    create: function(){
        var me = this;

        var buttonWidth = 190;
        var buttonHeight = 50;
        var centerX = me.game.world.centerX;
        var centerY = me.game.world.centerX;
        //me.slickUI.add(panel = new SlickUI.Element.Panel(0, 0, me.game.width, me.game.height));
        var labels = game.cache.getJSON('labels');

        //	Our background
        game.add.image(0, 0, 'background');

        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 0, me.game.width, (me.game.height*0.1));

        var style = { font: "32px Bold Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  The Text is positioned at 0, 100
        text = game.add.text(0, 0, labels['Game_Title'], style);
        //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
        text.setTextBounds(0, 0, me.game.width, (me.game.height*0.1));


        var LabelButton = function(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame){
            Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);    
            //Style how you wish...    
            this.style = {'font': '20px Arial', 'fill': 'white'};    
            this.anchor.setTo(0.5, 0.5);
            this.label = new Phaser.Text(game, 0, 0, label, this.style);

            //puts the label in the center of the button    
            this.label.anchor.setTo(0.5, 0.5);
            this.addChild(this.label);
            this.setLabel(label);
            //adds button to game
            game.add.existing(this);
        };
        
        LabelButton.prototype = Object.create(Phaser.Button.prototype);
        LabelButton.prototype.constructor = LabelButton;
        LabelButton.prototype.setLabel = function(label) {
            this.label.setText(label);
        };        

        var WSbutton = new LabelButton(this.game, centerX, (me.game.height*.25), 'button' , labels.Game_Types[0]['Label'], function(){
            this.actionOnClick(labels.Game_Types[0]['Key']);
        }, this, 'over', 'out', 'up', 'down'); 

        var CWbutton = new LabelButton(this.game, centerX, ((me.game.height*.25)+(60)), 'button' , labels.Game_Types[1]['Label'], function(){
            this.actionOnClick(labels.Game_Types[1]['Key']);
        }, this, 'over', 'out', 'up', 'down'); 

        var WQbutton = new LabelButton(this.game, centerX, ((me.game.height*.25)+(2*60)), 'button' , labels.Game_Types[2]['Label'], function(){
            this.actionOnClick(labels.Game_Types[2]['Key']);
        }, this, 'over', 'out', 'up', 'down'); 

        var WGbutton = new LabelButton(this.game, centerX, ((me.game.height*.25)+(3*60)), 'button' , labels.Game_Types[3]['Label'], function(){
            this.actionOnClick(labels.Game_Types[3]['Key']);
        }, this, 'over', 'out', 'up', 'down'); 
        
        //this.button = new LabelButton(this.game, 300, 300, 'button', 'Hello', this.actionOnClick, this, 'over', 'out', 'up', 'down'); 
        /*for(index=0; index<labels.Game_Types.length; index++){
            var label = labels.Game_Types[index];
            //this.button = new LabelButton(this.game, centerX, ((me.game.height*.25)+(index*60)), 'button' , label['Label'], this.actionOnClick, this, 'over', 'out', 'up', 'down'); 
            alert(label['Key']);
            var button = new LabelButton(this.game, centerX, ((me.game.height*.25)+(index*60)), 'button' , label['Label'], function(){
                this.actionOnClick(label['Key']);
            }, this, 'over', 'out', 'up', 'down'); 
            alert(button);
            //me.button = new LabelButton(this.game, (centerX-(buttonWidth/2)), ((me.game.height*.4)+(buttonHeight*index)), "button",
            //this.button.name = label['Key'];
        }*/
		//game.state.start("Main");    
    },
    
    actionOnClick: function(key){
        localStorage.setItem('gameType', key);
        this.game.state.start('LevelManager');        
    }

}
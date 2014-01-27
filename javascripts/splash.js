
var splashText = function(game, text, seconds, andThen, customStyle)
{
    var defaultStyle = 
    {
        font: "30px Arial",
        fill: "white",
       // No idea if any of the objects below this work.
        align: "center",
        stroke: "black",
        strokeThickness: 10,
        wordWrap: true, // Ok, word-wrap works
        wordWrapWidth: 1000,
    };
    var style = defaultStyle;

    if (customStyle)
    {
        for (var x in defaultStyle)
        {
            if (customStyle[x] == undefined)
            {
                customStyle[x] = defaultStyle[x];
            }
        }
        style = customStyle;
    }

    game.input.disabled = true;
    game.paused = true;
    game.stage.disableVisibilityChange = true;
    
    var textObj = game.add.text(game.world.width/2,game.world.height/2 ,text, style);
    textObj.anchor.x = 0.5;
    textObj.anchor.y = 0.5;
     
    var unpause = function()
    {
        textObj.destroy();
        game.paused = false;
        game.stage.disableVisibilityChange = false;
        game.input.disabled = false;
        if (andThen)
        {
            andThen();
        }
    };

    window.setTimeout(unpause, seconds * 1000);
};


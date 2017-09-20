// Utility functions

// Beautify the numbers
function Beautify(what, floats) {
    var str = '';
    what =  Math.round(what*100000)/100000; // Rounding error prevention
    if(floats>0) {
        var floater = what-Math.floor(what);
        floater = Math.round(floater*100000)/100000;
    }
}


Game = {};

Game.launch = function() {
    // Global click amount
    Game.clickCount = 0;
    
    Game.initClicker = function() {
        var canvas = document.getElementById('bigClicker');
        var context = canvas.getContext('2d');
    
        context.fillStyle = '#722210';
        context.beginPath();
        context.arc(canvas.width/2, canvas.height/2, 125, 0, 2*Math.PI);
        context.fill();
    };

    // Clicking Maths
    Game.earn = function(amount) {
        Game.clickCount += amount;
    };

    // Clicking the clicker;
    Game.clickEvent = function(event, amount) {
        var computedMouseCps = 1;
        var lastClick = 0;
        var canClick = 1;
        var now = Date.now();
        if(now-lastClick < 1000/250) {}
        var amount = amount ? amount : computedMouseCps;
        Game.earn(amount);
        Game.clickCount += amount;
        console.log(clickCount);
        lastClick = now;
    };
    
    // Click display
    Game.clickDisplay = function(amount) {
        document.getElementById('clickCounter').innerHTML = Game.clickCount;
    }

    // Main document load module
    Game.initClicker();
}

$(document).ready(function () {
    Game.launch();
});
// Global values

// Global amount of cookies earned.
var cookieCount = 0;

// For the big "clicker" object
function initClicker() {
    var canvas = document.getElementById('bigClicker');
    var context = canvas.getContext('2d');
    
    context.fillStyle = '#F00';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// Clicking Maths
function earn(amount) {
    cookieCount += amount;
}

// Clicking the clicker;
function clickEvent(event, amount) {
    var computedMouseCps = 1;
    var lastClick = 0;
    var canClick = 1;
    
    var now = Date.now();
    if(event) event.preventDefault();
    else if(now-lastClick < 1000/250) {}
    else {
        var amount = amount ? amount : computedMouseCps;
        earn(amount);
        cookieCount += amount;
    }
    lastClick = now;
}

// Main document load module
$(document).ready(function () {
    initClicker();
});
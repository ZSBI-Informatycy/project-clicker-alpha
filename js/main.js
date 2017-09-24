//---------------------------//
// Utility functions
//---------------------------//

function l(what) {
    return document.getElementById(what);
}

// Beautify the numbers
function Beautify(what, floats) {
    var str = '';
    what = Math.round(what * 100000) / 100000; // Rounding error prevention
    if (floats > 0) {
        var floater = what - Math.floor(what);
        floater = Math.round(floater * 100000) / 100000;
    }
}

Game = {};

Game.Launch = function() {

    Game.Init = function() {
        Game.T = 0;
        Game.fps = 30;
        Game.version = 0.101;

        // Latency compensation
        Game.time = new Date().getTime();
        Game.fpsMeasure = new Date().getTime();
        Game.accumulatedDelay = 0;
        Game.catchupLogic = 0;

        Game.clicksEarned = 0; // All clicks earned during gameplay
        Game.clicks = 0; // Clicks
        Game.clicksD = 0; // Clicks display
        Game.clicksPs = 0; // Clicks per second
        Game.handmadeClicks = 0; // Clicks made manually

        Game.startDate = parseInt(new Date().getTime());

        Game.InitClicker = function() {
            var canvas = l('bigClicker');
            var context = canvas.getContext('2d');

            context.fillStyle = '#722210';
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, 155, 0, 2 * Math.PI);
            context.fill();
        };

        //---------------------------//
        // Clicking Economics
        //---------------------------//

        // Earning Cookies
        Game.Earn = function(amount) {
            Game.clicks += amount;
            Game.clicksEarned += amount;
        };

        // Spending cookies
        Game.Spend = function(amount) {
            Game.clicks -= amount;
        };

        Game.computedMouseCps = 1;
        Game.globalCpsMult = 1;
        Game.lastClick = 0;

        // Temporary solution
        Game.mouseCps = function() {
            var mult = 1;
            return mult;
        };

        // Clicking the clicker
        Game.ClickObject = function(event, amount) {
            var canClick = 1;
            var now = Date.now();
            if (now - Game.lastClick < 1000 / 250) {}
            var amount = amount ? amount : Game.computedMouseCps;
            Game.handmadeClicks += Game.computedMouseCps;
            Game.Earn(amount);
            l('clickDisplay').innerHTML = Game.clicksEarned;
            Game.lastClick = now;
        };

        // Click display
        Game.ClickDisplay = function() {
            l('bigClicker').onClick = Game.ClickObject(onclick, 20);
        };

        //---------------------------//
        // CpS recalculator
        //---------------------------//
        Game.recalculateGains = 1;
        Game.CalculateGains = function() {
            Game.clicksPs = 0;
            var mult = 1;

            for (var i in Game.Upgrades) {
                var me = Game.Upgrades[i];
                if (me.bought > 0) {
                    if (me.type === 'mult' && Game.Has(me.name)) mult += me.power * 0.01;
                }
            }

            for (var i in Game.Objects) {
                var me = Game.Objects[i];
                me.storedCps = (typeof(me.cps) === 'function' ? me.cps() : cps);
                me.storedTotalCps = me.amount * me.storedCps;
                Game.clicksPs += me.storedTotalCps;
            }

            Game.globalCpsMult = mult;
            Game.clicksPs *= Game.globalCpsMult;

            Game.computedMouseCps = Game.mouseCps();
            Game.recalculateGains = 0;
        };

        //---------------------------//
        // Buildings
        //---------------------------//
        Game.priceIncrease = 1.15;
        Game.Objects = [];
        Game.ObjectsById = [];
        Game.ObjectsN = 0;
        Game.ObjectsOwned = 0;

        Game.Object = function(name, desc, icon, price, cps, drawFunction, buyFunction) {
            this.id = Game.ObjectsN;
            this.name = name;
            this.displayName = this.name;
            this.desc = desc;
            this.basePrice = price;
            this.price = this.basePrice;
            this.cps = cps;
            this.totalClicks = 0;
            this.storedCps = 0;
            this.storedTotalCps = 0;
            this.icon = icon;
            this.buyFunction = buyFunction;
            this.drawFunction = drawFunction;

            this.amount = 0;
            this.bought = 0;

            this.buy = function() {
                var price = this.basePrice * Math.pow(Game.priceIncrease, this.amount);

                if (Game.clicks >= price) {
                    Game.Spend(price);
                    this.amount++;
                    this.bought++;
                    price = this.basePrice * Math.pow(Game.priceIncrease, this.amount);
                    this.price = price;
                    if (this.buyFunction) this.buyFunction();
                    if (this.drawFunction) this.drawFunction();
                    Game.recalculateGains = 1;
                    Game.ObjectsOwned++;
                }
            };

            this.sell = function() {
                var price = this.basePrice * Math.pow(Game.priceIncrease, this.amount);
                price = Math.floor(price * 0.5);

                if (this.amount > 0) {
                    Game.clicks += price;
                    this.amount--;
                    price = this.basePrice * Math.pow(Game.priceIncrease, this.amount);
                    this.price = price;
                    if (this.sellFunction) this.sellFunction();
                    if (this.drawFunction) this.drawFunction();
                    Game.recalculateGains = 1;
                    Game.BuildingsOwned--;
                }
            };

            Game.Objects[this.name] = this;
            Game.ObjectsById[this.id] = this;
            Game.ObjectsN++;

            return this;
        };

        //---------------------------//
        // Upgrades
        //---------------------------//
        Game.Upgrades = [];
        Game.UpgradesById = [];
        Game.UpgradesN = 0;
        Game.UpgradesOwned = 0;

        Game.Upgrade = function(name, desc, price, icon, buyFunction) {
            this.id = Game.UpgradesN;
            this.name = name;
            this.desc = desc;
            this.basePrice = price;
            this.icon = icon;
            this.buyFunction = buyFunction;
            this.unlocked = 0;
            this.bought = 0;
            this.hide = 0;
            this.order = this.id;
            if(order) this.order = order + this.id * 0.001;
            this.type = '';
            if(type) this.type = type;
            this.power = 0;
            if(power) this.power = power;

            this.buy = function() {
                var.cancelPurchase = 0;
                if(this.clickFunction) cancelPurchase=!this.clickFunction();
                if(!cancelFunction) {
                    var price = this.basePrice;
                    if(Game.clicks >= price && !this.bought) {
                        Game.Spend(price);
                        this.bought = 1;
                        if(this.buyFunction) this.buyFunction();
                        Game.recalculateGains = 1;
                        Game.UpgradesOwned++;
                    }
                }
            };
        };

        // Do you have this upgrade?
        Game.Has=function(what)
        {
            return (Game.Upgrades[what]?Game.Upgrades[what].bought:0);
        }
        
        // Initiate the canvas.
        Game.InitClicker();
    };
    // Main init module
    Game.Init();
};

$(document).ready(function() {
    Game.Launch();
});
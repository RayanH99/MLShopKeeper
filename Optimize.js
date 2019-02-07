$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
    var demand = []; //array stores demand for each department of the shop
    var shops = []; //array stores multiple "department" objects which each have the stock distributed differently, thus resulting in different profits
    var days = 20;//days before array is spliced, thus elimnating the lower profit inventory distributions
    var add = 12;
    var subtract = 3; //for random variation we can remove 3 from 4 of the 5 departments and then add 12 to the remaining department and then check the profit
    
    function rand(n){ //random number function
		return Math.floor(Math.random() * n);
	}
    
    function text(color, text, x, y){ //writing text function
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    
    function line(color, x1, y1, x2, y2){ //drawing line function
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    function rect(color, x, y, w, h){ //drawing rectangle function
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
    
    //depts 1-5 represent amount of inventory in each dept, cost is cost of production, sell is price of selling
    function departments(dept1, dept2 ,dept3, dept4, dept5, cost, sell){ 
        this.stock = [dept1, dept2, dept3, dept4, dept5]; //this array holds original stock values
        this.demanded = [dept1, dept2, dept3, dept4, dept5]; //this array holds a copy of the stock, these will be edited based on demand
        this.profit = [];
        this.difference = [];
        this.totalStock = dept1+dept2+dept3+dept4+dept5; 
        this.totalProfit = 0;
        for(var i=0; i<5; i++){
            this.demanded[i] = (this.totalStock*demand[i]); //this determines amount of product demanded per dept.
            this.difference[i] = this.stock[i] - this.demanded[i] //determines whether supply is excess or lacking based on demand, positive means excess, negative means lacking
            
            if(this.difference[i] < 0){ //case where there isnt enough supply
                this.profit.push(this.stock[i]*sell-((this.stock[i]*cost)-this.difference[i]*sell)); //this calculates profit including potential profit loss due to not having enough supply
            } else if(this.difference[i] > 0){ //case where there is excess supply
                this.profit.push(this.demanded[i]*sell-((this.stock[i]*cost)+this.difference[i]*cost)) //this calculates profit including cost of production wasted on the excess supply
            } //DIDN'T INCLUDE ZERO CASE, WILL DO IT LATER
            
            this.totalProfit += this.profit[i];
            
        }
    console.log(this.totalProfit);
        
    }
    
    function learn(){ //function for the shop to try different combinations of stock distribution and learn from which combinations yield the highest profit
        var p1 = rand(shops.length);
        var p2 = rand(shops.length); //parents 1 and 2 to "breed"
        
        if(p2 == p1){//makes sure p1 and p2 aren't the same object
            p2 = rand(shops.length);
        }
        
        shops.push(new departments(
            ((shops[p1].stock[0] + shops[p2].stock[0])/2),
            ((shops[p1].stock[1] + shops[p2].stock[1])/2),
            ((shops[p1].stock[2] + shops[p2].stock[2])/2),
            ((shops[p1].stock[3] + shops[p2].stock[3])/2),
            ((shops[p1].stock[4] + shops[p2].stock[4])/2),
            5, 15)) //creates a new department object which averages the values of the 2 parents
        
        var num = Math.random(); // picks a random number between 0 and 1
        //the following section of code uses the random number to pick a stock amount to increase and the rest to decrease. This is the "random variation" part of the genetic algorithm. 
        if(0 < num < 0.2){
            shops[shops.length-1].stock[0] += add;
            shops[shops.length-1].stock[1] -= subtract;
            shops[shops.length-1].stock[2]-= subtract;
            shops[shops.length-1].stock[3] -= subtract;
            shops[shops.length-1].stock[4] -= subtract;
        }else if(0.2 < num < 0.4){
            shops[shops.length-1].stock[1] += add;
            shops[shops.length-1].stock[0] -= subtract;
            shops[shops.length-1].stock[2] -= subtract;
            shops[shops.length-1].stock[3] -= subtract;
            shops[shops.length-1].stock[4] -= subtract;
        }else if(0.4 < num < 0.6){
            shops[shops.length-1].stock[2] += add;
            shops[shops.length-1].stock[0] -= subtract;
            shops[shops.length-1].stock[1] -= subtract;
            shops[shops.length-1].stock[3] -= subtract;
            shops[shops.length-1].stock[4] -= subtract;
        }else if(0.6 < num < 0.8){
            shops[shops.length-1].stock[3] += add;
            shops[shops.length-1].stock[0] -= subtract;
            shops[shops.length-1].stock[1] -= subtract;
            shops[shops.length-1].stock[2] -= subtract;
            shops[shops.length-1].stock[4] -= subtract;
        }else if(0.8 < num < 1){
            shops[shops.length-1].stock[4] += add;
            shops[shops.length-1].stock[0] -= subtract;
            shops[shops.length-1].stock[1] -= subtract;
            shops[shops.length-1].stock[2] -= subtract;
            shops[shops.length-1].stock[3] -= subtract;
        }
        
        console.log("Shop keeper has tried something new. " + shops[shops.length-1].stock);
        
        if(shops[shops.length-1].totalStock > 1000)shops.splice(shops.length-1, 1); //splices any object from the array if its stock value ends up exceeding the stock limit of 1000
        
        if(shops[shops.length-1].totalProfit > 10000)shops.splice(shops.length-1, 1); //splices any object that goes beyond the highest possible total profit 10000
        
        var temp;
		for(var s=0; s<shops.length; s++){ //Bubble Sort for totalProfit
            for(var t=1; t < shops.length; t++){
				if(shops[s].totalProfit > shops[t].totalProfit){
					temp = shops[s];
				    shops[s] = shops[t];
				    shops[t] = temp;
				}  
				console.log("Total Profits sorted");
			}	
		}
        
        if(shops.length > days - 1){
			shops.splice(Math.floor(shops.length/2));
            console.log("Spliced bottom half of inventory distributions that resulted in lower total profits")
		}
    } 	
    
    for(var i=0; i<5; i++){ //the values for the demand of each department are created outside of any function as it must only be run once and remain the same throughout the entire program
        var c = prompt("Enter 5 values that add up to 100, these will represent the demand of each department in percentage (i.e. 20 = 20% demand)", "Enter values, 1 prompt at a time: ");
        demand.push(c/100);
    }
    

    shops.push(new departments(200, 200, 200, 200, 200, 5, 15)); //creates object departments with 200 inventory items in each dept and cost of production 5 and selling price 15
    shops.push(new departments(200, 200, 200, 200, 200, 5, 15)); //creates another object departments so it can be used as the other "parent" for the breeding part of the genetic algorithm, this is required because 2 objects are required initially to run the random variation function, learn()
        
	/////////////////////////////////
	////////////////////////////////
	// PROGRAM INIT
	//	Runs this code right away, as soon as the page loads.
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		
	
    //////////////////////
	//////////////////////
	// PROGRAM ENGINE START
	//////////////////////
    //////////////////////

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 100); //speed of program
	}

	init();	
	
    /////////////////////////////////
	////////////////////////////////
	// MAIN PROGRAM ENGINE
	/////////////////////////////////
	////////////////////////////////
            
    function paint()
	{
		
		ctx.fillStyle = 'gray';
		ctx.fillRect(0,0, w, h);	
		 
        line('black', 70, 40, 70, 440);
        line('black', 70, 440, 570, 440);
        
        rect('cyan', 120 + (95 * 0), (h -(((shops[shops.length-1].stock[0] / 50) * 40) + 50)), 20, 20);
        rect('lime', 120 + (95 * 1), (h - (((shops[shops.length-1].stock[1] / 50) * 40) + 50)), 20, 20);
        rect('pink', 120 + (95 * 2), (h - (((shops[shops.length-1].stock[2] / 50) * 40) + 50)), 20, 20);
        rect('orange', 120 + (95 * 3), (h - (((shops[shops.length-1].stock[3] / 50) * 40) + 50)), 20, 20);
        rect('yellow', 120 + (95 * 4), (h - (((shops[shops.length-1].stock[4] / 50) * 40) + 50)), 20, 20);
        
        ctx.textAlign = 'center';
        text('cyan', 'Department 1: ' + shops[shops.length-1].stock[0], 630, 40); 
        text('lime', 'Department 2: ' + shops[shops.length-1].stock[1], 630, 60);
        text('pink', 'Department 3: ' + shops[shops.length-1].stock[2], 630, 80);
        text('orange', 'Department 4: ' + shops[shops.length-1].stock[3],630, 100);
        text('yellow', 'Department 5: ' + shops[shops.length-1].stock[4], 630, 120);
        text('red', 'Total Profit: ' + shops[shops.length-1].totalProfit, 630, 140);
        text('black', 'PRESS "P" TO PAUSE', 630, 160);
        
        text('cyan', 'Department 1', 120 + (95 * 0) + 10, 460); 
        text('lime', 'Department 2', 120 + (95 * 1) + 10, 460);
        text('pink', 'Department 3', 120 + (95 * 2) + 10, 460);
        text('orange', 'Department 4', 120 + (95 * 3) + 10, 460);
        text('yellow', 'Department 5', 120 + (95 * 4) + 10, 460);
        
        for(var i = 10; i >= 0; i--){
            ctx.fillStyle = 'black';
            ctx.textAlign="right";
            ctx.fillText(i * 50, 65, (h - (i * 40)) - 40);
        } 
        
        learn();
    }
    
    //////////////////////
	//////////////////////
	// KEYBOARD INPUT
	//////////////////////
    //////////////////////
    
    window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
        
        if(key == 80){ //Press P to pause
            alert("Paused");
        }
        
        }, false);
    
    
}) //The End
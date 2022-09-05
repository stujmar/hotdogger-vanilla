/**
 * Takes in allFood array and displays the upgrade quantities on the HTML
 * @param {*} arrayObject Takes in array of objects allFood
 */
const displayUpgrades = (arrayObject, displayScores) => {
    document.getElementById('total-clicks').innerHTML = displayScores.clicked;
    document.getElementById('condiment-multi').innerHTML = displayScores.clickMultiplier.toFixed(2);
    if (arrayObject[0].owned !== 0 || arrayObject[1].owned !== 0) { //Clever, This makes the dog total an integer unless you have upgrades that would dictate otherwise.
        document.getElementById('total').innerHTML = (displayScores.total).toFixed(2); 
    } else {
        document.getElementById('total').innerHTML = parseInt(displayScores.total);
    }
    for (let i=0; i<arrayObject.length; i++) { //lets look through our array
        document.getElementById(`${arrayObject[i].name}-score`).innerHTML = arrayObject[i].owned;
        document.getElementById(`${arrayObject[i].name}-cost`).innerHTML = arrayObject[i].cost;
    }
}


/**
 * Adds score to topping upgrade
 * @param {*} toppingParam id of relavent upgrade.
 */
const addToppingScore = (allFood) => { // instead of DOM #foodName-score I want to updated allFood.owned
    let addScore = allFood.owned;
    addScore++;
    allFood.owned = addScore;
}

/**
* This turns on food that is affordable.
*/
const checkUnlocked = (arrayObject, displayScores) => {
    let totalDogs = parseFloat(displayScores.total);
    for (let i=0; i<arrayObject.length; i++) {
        if (totalDogs >= arrayObject[i].reqDogs) {
            document.getElementById(`${arrayObject[i].name}-click`).style.display = 'block';
        } else if (totalDogs == 0){ //clears upgrades on reset
            document.getElementById(`${arrayObject[i].name}-click`).style.display = 'none';
        }
    }
}

/**
* Takes condiment clicks and turns them into increase click multipliers.
* @param {string} condi this is a string of the condiment name.
* @param {number} clickMultiplier this is the click multiplier .01 == 1%. additive not compounding.
*/
const addCondiScore = (arrayObject, displayScores) => { 
    let addScore = arrayObject.owned;
    addScore++;
    arrayObject.owned = addScore;
    displayScores.clickMultiplier += arrayObject.multiplier;
    }

// /**
//  * This updates the hotdogs per hotdog click, first multiplying the condiment multiplier
//  * @param {number} singleClick independently scale the value of a click by increasing this. 1 = 100% clickpower
//  */
// const addDogScoreOld = (singleClick) => { //I want to make this an object in a main function that holds all the scores instead of storing them in html
//     let addScore = parseFloat(document.getElementById('total').innerHTML);
//     addScore += singleClick * document.getElementById('condiment-multi').innerHTML;
//     document.getElementById('total').innerHTML = addScore.toFixed(2);
// }

const addToppingDPS = (arrayObject, displayScores) => {
    arrayObject.forEach((element) => {
        let speedPower = 0;
        if (!element.isSauce) {
            speedPower = element.multiplier*element.owned*parseFloat(displayScores.clickMultiplier.toFixed(2));
            displayScores.total += parseFloat(speedPower/10);
        }
     });
}

const addDogScore = (scoreObject) => { 
    let numOne = 1 * scoreObject.clickMultiplier; 
    let numTwo = scoreObject.total;
    let numThree = parseFloat((numOne + numTwo).toFixed(2));
    scoreObject.total = numThree; //update total
}

/**
* Add this to anything you want to count as a click. Clicks are for unlocks and highscores etc.
*/
const addClicksScore = (displayScores) => { 
    displayScores.clicked += 1;
    }


const checkCost = (allFood, displayScores) => { 
    let checkedCost = allFood.cost;
    let checkedMoney = displayScores.total;
    if (checkedCost <= checkedMoney) {
        return true;
    } else {
        return false;
    } 
} 

const updateCost = (arrayObject, displayScores) => {
    displayScores.total -= parseFloat(arrayObject.cost); //Pay for current cost
    arrayObject.cost = (arrayObject.cost*arrayObject.costInc).toFixed(2); //Update the cost of the next item
}

const checkCostStyle = (idPrefix) => {
    let checkedCost = parseFloat(document.getElementById(`${idPrefix}-cost`).innerHTML);
    let checkedMoney = parseFloat(document.getElementById('total').innerHTML);
    if (checkedCost <= checkedMoney) {  
        document.getElementById(`${idPrefix}-background`).style.background = 'rgb(228, 138, 220)';
        return true;
    } else {
        document.getElementById(`${idPrefix}-background`).style.background = 'rgb(167, 84, 160)';
        return false;
    }
}

/**
 * This is the main function that runs most of the stuff.
 */
const main = () => {
    let allFood = [ //I am beginning to make all upgrade related data live here.
        {name: 'ketchup' , reqDogs: 5,    isSauce: true,  multiplier: 0.01, cost:    1, costInc: 1.05, owned: 0}, 
        {name: 'mustard' , reqDogs: 15,   isSauce: true,  multiplier: 0.02, cost:    2, costInc: 1.10, owned: 0},  
        {name: 'relish'  , reqDogs: 25,   isSauce: true,  multiplier: 0.05, cost:    3, costInc: 1.25, owned: 0},  
        {name: 'bbq'     , reqDogs: 35,   isSauce: true,  multiplier: 0.10, cost:    4, costInc: 1.50, owned: 0}, 
        {name: 'cheese'  , reqDogs: 1000, isSauce: true,  multiplier: 1.00, cost: 1000, costInc: 3.00, owned: 0}, 
        {name: 'onions'  , reqDogs: 10,   isSauce: false, multiplier: 1.00, cost:   10, costInc: 1.05, owned: 0},  
        {name: 'pickles' , reqDogs: 20,   isSauce: false, multiplier: 2.00, cost:   20, costInc: 1.10, owned: 0},  
        {name: 'tomatoes', reqDogs: 50,   isSauce: false, multiplier: 3.00, cost:   50, costInc: 1.25, owned: 0},  
        {name: 'peppers' , reqDogs: 100,  isSauce: false, multiplier: 4.00, cost:  100, costInc: 1.50, owned: 0}
    ];

    let displayScores = { //Store all scores
        total: 0,
        clicked: 0,
        eaten: 0,
        clickMultiplier: 1
    };

    let currentStoryIndex = 0; // Current Index of pop up story
    const milestone = [0,5,50,100,250,500,1000,2000,3000,4000,5000]; // Total dogs required to trigger Story
    const stories = [
        '<p>Welcome to Hot Dogger! </br> The game where you click a giant hot dog. </br> Give it a try, click that dog! Get 5 hot dogs and I bet you can afford some delicious ketchup.</ p>',
        `Congratulations you have ${milestone[1]} dogs! You unlocked ketchup! Ketchup increases your clicking power! Load up on ketchup!`,
        `Congratulations you have ${milestone[2]} dogs`,
        `Congratulations you have ${milestone[3]} dogs!`,
        `Congratulations you have ${milestone[4]} dogs!`,
        `Congratulations you have ${milestone[5]} dogs!`,
        `Congratulations you have ${milestone[6]} dogs!`,
        `Congratulations you have ${milestone[7]} dogs!`,
        `Congratulations you have ${milestone[8]} dogs!`,
        `Congratulations you have ${milestone[9]} dogs!`,
        `Congratulations you have ${milestone[10]} dogs!`
    ];
    
    

    document.getElementById("exit").addEventListener('click',(e) => { //Listens for exit button" to close story pop-up
        e.preventDefault();
        document.getElementById("story-container").style.display = 'none';  
    });
    

    // if (document.cookie) { //if there are no cookies to set dog count set it to zero
    //     displayScores.total = document.cookie;
    // } else {
    //     document.getElementById('total').innerHTML = 0;
    // }
    
    window.setInterval(function(){ //RUNNING LOOP
        addToppingDPS(allFood, displayScores);

        if (displayScores.total >= milestone[currentStoryIndex]) { //Pops up story if you have the milestone amount of Hotdogs
            document.getElementById("story-box").innerHTML = stories[currentStoryIndex];
            document.getElementById("story-container").style.display = 'block';
            currentStoryIndex++ 
        }

        document.getElementById('total').innerHTML = displayScores.total;
        for (let i=0; i<allFood.length; i++) { //Checking what is affordable to grey it out or not. maybe loop should be in function.
            checkCostStyle(allFood[i].name);
        }
        
        checkUnlocked(allFood, displayScores); //turn display:block; on of unlocked food.
        displayUpgrades(allFood, displayScores);
       
        
        // document.cookie = document.getElementById('total').innerHTML; //store dogs in cookies
    },100); //We are refreshing 10 times a second 

    document.getElementById("dog-button").addEventListener('click', (e) => {
        // let checkedMoney = parseFloat(document.getElementById('total').innerHTML); //look into this.
        // if (checkedMoney > 0){
        // e.preventDefault();
        // } else {
        //     navigator.vibrate(250);
        // }
        addDogScore(displayScores);
        addClicksScore(displayScores);
    });

    document.getElementById("reset").addEventListener('click',(e) => { //Resets all quantities owned in the allFood.
        displayScores.total = 0; 
        displayScores.clicked = 0;
        displayScores.eaten = 99;
        displayScores.clickMultiplier = 1;
        
        allFood.forEach((element) => { //This is my first functioning forEach loop 3/13/2020
            element.owned = 0;
            document.getElementById(`${element.name}-score`).innerHTML = element.owned;
        });
    });
    
    /* If I every put eating hotdogs back into the game. */
    // document.getElementById("eat").addEventListener('click',(e) => {
    //     e.preventDefault();
    //     let addScore = parseInt(document.getElementById('eaten').innerHTML);
    //     addScore += 1;
    //     document.getElementById('eaten').innerHTML = addScore;
    //     displayScores.total -= 1; //Is this ok?
    //     addClicksScore(displayScores); 
    // });
    
    document.getElementById("save").addEventListener('click',(e) => { //Resets all quantities owned in the allFood.
        console.log('saving');
        let food = JSON.stringify(allFood);
        let scores = JSON.stringify(displayScores);
        document.cookie = food + "#" + scores;
        console.log('saved');
    });
    
    document.getElementById("load").addEventListener('click',(e) => { //Resets all quantities owned in the allFood.
        console.log('loaded scores');
        let cookieToParse = document.cookie;
        let split = cookieToParse.split('#');
        allFood = JSON.parse(split[0]);
        displayScores = JSON.parse(split[1]);
    });

    for (let i=0; i<allFood.length; i++) { //Toppings Event Listeners
        let sourceTopping = allFood[i];
        let targetElement = document.getElementById(`${sourceTopping.name}-click`);
        if (!sourceTopping.isSauce){
            targetElement.addEventListener("click",(e) => {
                e.preventDefault();
                if (checkCost(allFood[i], displayScores)) {
                    addToppingScore(allFood[i]);
                    addClicksScore(displayScores);
                    updateCost(allFood[i], displayScores);
                }
            });//event function
        }//close isSauce
    }//for loop
    
    for (let i=0; i<allFood.length; i++) { //Sauces Event Listeners
        let sourceSauce = allFood[i]; 
        let targetElement = document.getElementById(`${sourceSauce.name}-click`);
        if(sourceSauce.isSauce){
            targetElement.addEventListener("click",(e) => {
            e.preventDefault();
            if (checkCost(allFood[i], displayScores)) {
                addCondiScore(allFood[i], displayScores);
                addClicksScore(displayScores);
                updateCost(allFood[i], displayScores);
            }
            }); //event function
        } // close isSauce
    } //for loop
    

}// close main function

main();


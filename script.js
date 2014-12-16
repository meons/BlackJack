// Global variables
var initialized = false;
var playerName;

var cardsArray; // All cards with all needed infos/values
var totalCardsDrawed; // Drawed cards counter (for each party)
var finished; // The party is finished

var playerHand; // Array containing player cards array when he split
var playerCards; // Player cards array (for each party)
var playerPoints; // Player points (for each party)
var playerMoney; // Player money
var playerBet; // Player bet (for each party)

var bankCards; // Bank cards (for each party)
var bankPoints; // Bank points (for each party)

//var totalBet;
//var gameBet;

// Play a card animation with Circulate library
function animateCard()
{
    $("#" + totalCardsDrawed).slideUp("slow");
    $("#" + totalCardsDrawed).slideDown(1000);
}

function checkParty()
{
	// If BlackJack
	if (playerPoints == 21 && playerCards.length == 2)
	{
		playerWinBlackJack();
	}
	// If player busts
	else if (playerPoints > 21)
	{
		bankWin();
	}
	// If bank busts
	else if (bankPoints > 21)
	{
		playerWin();
	}
	// If player is bether that bank
	else if (playerPoints > bankPoints && bankPoints >= 17)
	{
		playerWin();
	}
	// If bank is bether that bank
	else if (playerPoints < bankPoints && bankPoints >= 17)
	{
		bankWin();
	}
	// If bank and player have same points
	else if (playerPoints == bankPoints && bankPoints >= 17)
	{
		equality();
	}
}

// When player wins with BlackJack
function playerWinBlackJack()
{
	playerMoney += playerBet * 2,5;
	$("#totalBetSpan").text(playerMoney);
        setDescription("BLACKJACK !!!");
	partyEnded();
}

// When player wins
function playerWin()
{
	playerMoney += playerBet * 2;
	$("#totalBetSpan").text(playerMoney);
        setDescription("Vous gagnez !");
	partyEnded();
}

// When bank wins
function bankWin()
{
	if (playerMoney == 0)
	{
		alert("You lose...");
	}
	$("#totalBetSpan").text(playerMoney);
        setDescription("La banque gagne !");
	partyEnded();
}

// When equality
function equality()
{
	playerMoney += playerBet * 1;
	$("#totalBetSpan").text(playerMoney);
        setDescription("Egalité");
	partyEnded();
}

function partyEnded()
{
	finished = true;
	//$("#play").prop("disabled", false);
	$("#btnDouble").prop("disabled", true);
	$("#stand").prop("disabled", true);
	$("#hit").prop("disabled", true);
        //Check if the player's total money is less than max of the slider, if not, set the slider's max
        var maxSlider = document.getElementById("betSlider").max;
        if(playerMoney < maxSlider)
        {
            document.getElementById("betSlider").max = playerMoney;
            document.getElementById("betSlider").value = playerMoney;
            document.getElementById("gameBetText").value = playerMoney;
        }
}

// Player double -> so he draw only 1 card and double the bet
function playerDouble()
{
    
	playerMoney -= playerBet;
	playerBet += playerBet;
	$("#totalBetSpan").text(playerMoney);
	playerDraw();
	// Bank don't need to draw if player busts
    if (finished == false)
    {
        bankDraw();    
    }
}

// Update bank points
function updateBankPoints()
{
    bankPoints = calculateBankPoints();
    $("#bankScore").text(bankPoints);
}

// Calculate bank points and manage count if aces are present
function calculateBankPoints()
{
    var points = 0;
    var aces = 0;
    for (var i in bankCards)
    {
        var point = bankCards[i][2];
        points += point;
        
        var id = bankCards[i][1];
        aces += id >= 1 && id <= 4;
    }

    while(points > 21 && aces > 0)
    {
        points -= 10;
        aces--;
    }
    
    return points;
}

// Update player points
function updatePlayerPoints()
{
    playerPoints = calculatePlayerPoints();
    $("#playerScore").text(playerPoints);
}

// Calculate player points and manage count if aces are present
function calculatePlayerPoints()
{
    var points = 0;
    var aces = 0;
    for (var i in playerCards)
    {
        var point = playerCards[i][2];
        points += point;
        
        var id = playerCards[i][1];
        aces += id >= 1 && id <= 4;
    }

    while(points > 21 && aces > 0)
    {
        points -= 10;
        aces--;
    }
    
    return points;	
}
// Deal a card (random)
function dealCard()
{
    totalCardsDrawed++;
    return Math.floor((Math.random() * 52) + 1);
	//return Math.floor((Math.random() * 8) + 1);
}

// Set a new game (new card draw)
function newGame()
{	
    //Disable new game button
    /*
    //Check if the party has been initialized
    if(partyStarted){
        return;
    }
    */
    
    // Initialize the game
    if(!initialized)
    {
        initialized = true;
        initializeGame();
    }
    newParty();
    if (playerMoney < playerBet)
        {
            $("#btnDouble").prop("disabled", true);
        }
    else
        $("#btnDouble").prop("disabled", false);
    /*
    //Check if game's bet has been set up
    if(checkBet())
    {
		// Initialise all variables for all game
		cardsArray = setDeck();
		//playerMoney = 1000;	
		newParty();
        setBackgroundColor("white");
        //Disable Double bet function if player's money is less than 2x player's bet
		// The initial bet is already decreased from playerMoney so don't need to do * 2
        if (playerMoney < playerBet)
        {
            $("#btnDouble").prop("disabled", true);
        }
        else
            $("#btnDouble").prop("disabled", false);
    }
    else
	{
        setBackgroundColor("red");
        //Add animation!
    }
    */
}
// Set a new party (when you enter into the casino)
function newParty()
{
    // Initialise all variables for a party
	bankCards = new Array();
	playerCards = new Array();
	bankPoints = 0;
	playerPoints = 0;
	totalCardsDrawed = 0;
	finished = false;
	playerBet = Number($("#gameBetText").val());
	playerMoney -= playerBet;
        
	$("#totalBetSpan").text(playerMoney);
	
	$("#btnDouble").prop("disabled", false);
	$("#stand").prop("disabled", false);
	$("#hit").prop("disabled", false);
	//$("#play").prop("disabled", true);
	
	$("#bank").empty();
	$("#player_cards").empty();       

	bankFirstDraw();
	playerDraw();
	setTimeout(function() {
            playerDraw();
    }, 1000);
	setDescription("Hit, Stand or Double!");
}

// Only 1 draw when game starts
function bankFirstDraw()
{
    
	bankCards.push(cardsArray[dealCard()]);
	$("#bank").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + bankCards[bankCards.length-1][1] + '.png"/>');
	updateBankPoints();
	animateCard();
}

// Bank draw until points are >= 17
function bankDraw()
{	
	//Check id the party has been initialized
        /*
	if(!partyStarted)
		return;
                */
			
	setTimeout(function()
    {
        bankCards.push(cardsArray[dealCard()]);
        $("#bank").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + bankCards[bankCards.length-1][1] + '.png"/>');
        animateCard();
        updateBankPoints();
        if(bankPoints < 17)
        {
            bankDraw();
        }
        checkParty();
    }, 1000);
}
// Player draw a card
function playerDraw()
{       
	//Check if the party has been initialized
        /*
	if(!partyStarted)
		return;
    */
		
	if (playerCards.length >= 2)
	{
		$("#btnDouble").prop("disabled", true);
		setDescription("Hit or Stand!");
	}
	playerCards.push(cardsArray[dealCard()]);
	$("#player_cards").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + playerCards[playerCards.length-1][1] + '.png"/>');
	updatePlayerPoints();
        animateCard();    
	checkParty();
}

// Prepare deck (52 cards) for Blackjack with all needed values for the game
// Array from 1 to 52 cases
// In each case an another array containing [Card name][Card id][PointsA][PointsB]
// Remarks :	card names are in same order that png card images
//				only Aces have PointsB because they can be worth 1 or 11
function setDeck()
{	
	var deck = new Array();
	// High cards Aces (A) -> 11 or 1 points
	deck[1] = new Array("Ac", 1, 11);
	deck[2] = new Array("As", 2, 11);
	deck[3] = new Array("Ah", 3, 11);
	deck[4] = new Array("Ad", 4, 11);
	
	// High cards from K to T -> 10 points for all	
	for (i = 5; i <= 20; i++)
	{
		setColorAndPoints(i, 10);
		setValue(i);
	}

	// Low cards from 9 to 2 -> Points from 9 to 2
	var points = 10;
	var step = 0;
	for (i = 21; i <= 52; i++)
	{
		// Step to decrease points by 1 every 4 passages into the loop
		if (step % 1 == 0)
		{
			points -= 1;
		}
		step += 0.25;
		
		setColorAndPoints(i, points);
		setValue(i);
	}
	/*
	for (i = 1; i <= 52; i++)
	{
		$("#cards").append('<p><img src="classic-cards/' + i + '.png"/>Card:' + deck[i][0] + ' PointsA:' + deck[i][1] + ' PointsB:' + deck[i][2] + '</p>');
	}
	*/
	return deck;
	
	// This function set color and points for a card
	function setColorAndPoints(cardId, points)
	{
		// Switch case with modulo to define color
		switch (cardId % 4)
		{
			case 1:
				deck[cardId] = new Array("c", cardId, points);
				break;
			case 2:
				deck[cardId] = new Array("s", cardId, points);
				break;
			case 3:
				deck[cardId] = new Array("h", cardId, points);
				break;
			case 0:
				deck[cardId] = new Array("d", cardId, points);
				break;
			default:
				break;
		}
	}
	
	// This function set figure for a card
	function setValue(cardId)
	{
		// King cards
		if (i >= 5 && i < 9)
		{
			deck[i][0] = "K" + deck[i][0];
		}
		// Queen cards
		if (i >= 9 && i < 13)
		{
			deck[i][0] = "Q" + deck[i][0];
		}
		// Jack cards
		if (i >= 13 && i < 17)
		{
			deck[i][0] = "J" + deck[i][0];
		}
		// Ten cards
		if (i >= 17 && i < 21)
		{
			deck[i][0] = "T" + deck[i][0];
		}
		// 9 cards
		if (i >= 21 && i < 25)
		{
			deck[i][0] = "9" + deck[i][0];
		}
		// 8 cards
		if (i >= 25 && i < 29)
		{
			deck[i][0] = "8" + deck[i][0];
		}
		// 7 cards
		if (i >= 29 && i < 33)
		{
			deck[i][0] = "7" + deck[i][0];
		}
		// 6 cards
		if (i >= 33 && i < 37)
		{
			deck[i][0] = "6" + deck[i][0];
		}
		// 5 cards
		if (i >= 37 && i < 41)
		{
			deck[i][0] = "5" + deck[i][0];
		}
		// 4 cards
		if (i >= 41 && i < 45)
		{
			deck[i][0] = "4" + deck[i][0];
		}
		// 3 cards
		if (i >= 45 && i < 49)
		{
			deck[i][0] = "3" + deck[i][0];
		}
		// 2 cards
		if (i >= 49)
		{
			deck[i][0] = "2" + deck[i][0];
		}
	}
}
function setPlayerName(){
    var textField = document.getElementById("playerName");
    playerName = textField.value;
    var name = document.getElementById("nameOfPlayer");
    if(playerName.length !== 0){            
        name.innerText = playerName;
    }
    else
        name.innerText = 'Anonyme';
}
function setTotalBet(){
    //var bet = document.getElementById("bet");
    var betDisplay = document.getElementById("totalBetSpan");
    
    //playerMoney = Number($("#bet").val());
    playerMoney = 1000;
    /*
    if(playerMoney < 300)
    {
        document.getElementById("betSlider").max = playerMoney;
    }
    */
    betDisplay.appendChild(document.createTextNode(playerMoney));
}
function initializeGame(){
        // Initialise all variables for all game
        cardsArray = setDeck();
        setPlayerName();
        setTotalBet();
        //var nameInput = document.getElementById("playerName").disabled = true;
        //var totalBetInput = document.getElementById("bet").disabled = true;       
        //$("#newgame").prop("disabled", true);
        //$("#play").prop("disabled", false);
        //Change description text
        setDescription("Click \"Play\" to start a new party");        
}
function checkBet(){
    var placedBet = document.getElementById("gameBetText");
    if(placedBet.value == '')
        return false;
    else{
        //playerMoney = placedBet.value;
        
        return true;
    }
        
}
function setBackgroundColor(color){
    document.getElementById("gameBetText").style.backgroundColor = color;
}
function checkEndGame(){
    //Game's end
    if(playerPoints == 21) //1 : total points is 21
    {
        setDescription("Congratulation");
    }
    else if(playerPoints > 21) //2 : Total points is more than 21
    {
        setDescription("Sorry, you lose!");
    }
}
//Description to guide the player through the game
function setDescription(desc){
    //Description for default theme
    document.getElementById("state").innerHTML = desc;
    //Description for classic theme
    if(!defaultTheme){
        document.getElementById("textClassicTheme").innerHTML = desc;
    }  
}

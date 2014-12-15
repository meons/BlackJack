function setDefaultTheme()
{
    $("#table").css("background-color", "green");
}

function setOrangeTheme()
{
    $("#table").css("background-color", "orange");
}

// Global variables
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

// This code is executed when the page loads
$(window).load(function() {

    // Initialise all variables for all game
    cardsArray = setDeck();
    playerMoney = 1000;
    $("#playerMoney").text(playerMoney);
    partyEnded(); // When the page loads, the game is in the same state that a ended party
});

// Slider for player bet
$(function() {
    $( "#slider" ).slider({
        value: 50,
        min: 50,
        max: 1000,
        step: 50,
        slide: function(event, ui) {
            $('#playerBet').text(ui.value);
        }
    });
});

// Set dynamically max for the bet slider
function setMaxSlider(max)
{
    $('#slider').slider("option", "max", max);
    $('#slider').slider("value", 50);    
}

// Play a card animation
function animateCard()
{
    $("#" + totalCardsDrawed).slideUp(0);
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
    $("#playerMoney").text(playerMoney);
    $("#winner").text("BLACKJACK !!!");
    partyEnded();
}

// When player wins
function playerWin()
{
    playerMoney += playerBet * 2;
    $("#playerMoney").text(playerMoney);
    $("#winner").text("Vous gagnez !");
    partyEnded();
}

// When bank wins
function bankWin()
{
    if (playerMoney == 0)
    {
        playerMoney = 1000;
        alert("The bank accorded you a 1000 credit.");
    }
    $("#playerMoney").text(playerMoney);
    $("#winner").text("La banque gagne !");
    partyEnded();
}

// When equality
function equality()
{
    playerMoney += playerBet * 1;
    $("#playerMoney").text(playerMoney);
    $("#winner").text("Egalité");
    partyEnded();
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

// Deal a card ==> Return a random value between 1 and 52 to select a random card from cardsArray (pre-created with setDeck method)
function dealCard()
{
    totalCardsDrawed++; // Increment draw counter
    return Math.floor((Math.random() * 52) + 1);
    //return Math.floor((Math.random() * 8) + 1);
}

// Start a new party
function newParty()
{
    // Initialise all variables for a party
    bankCards = new Array();
    playerCards = new Array();
    bankPoints = 0;
    playerPoints = 0;
    totalCardsDrawed = 0;
    finished = false;
    playerBet = Number($("#playerBet").text());
    playerMoney -= playerBet;

    $("#playerMoney").text(playerMoney);

    $("#slider").hide();
    $("#btnPlay").hide();
    $("#btnDraw").show();
    $("#btnStay").show();
    $("#btnDouble").show();

    $("#bank").empty();
    $("#player").empty();
    $("#winner").text("Infos");

    bankFirstDraw();
    playerDraw();
    setTimeout(function() {
            playerDraw();
    }, 1000);
}

// What happens when party is terminated
function partyEnded()
{
    finished = true;
    $("#btnPlay").show();
    $("#btnDraw").hide();
    $("#btnStay").hide();
    $("#btnDouble").hide();
    setMaxSlider(playerMoney);
    $('#playerBet').text($('#slider').slider("value"));
    $("#slider").show();
}

// Bank draw until points are >= 17
function bankDraw()
{
    setTimeout(function()
    {
        bankCards.push(cardsArray[dealCard()]);
        $("#bank").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + bankCards[bankCards.length-1][1] + '.png"/>');
        updateBankPoints();
        animateCard();
        if(bankPoints < 17)
        {
            bankDraw();
        }
        checkParty();
    }, 1000);
}

// Only 1 draw when game starts
function bankFirstDraw()
{
    bankCards.push(cardsArray[dealCard()]);
    $("#bank").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + bankCards[bankCards.length-1][1] + '.png"/>');
    updateBankPoints();
    animateCard();
}

// Player draw a card
function playerDraw()
{	
    if (playerCards.length >= 2)
    {
        $("#btnDouble").hide(); // Player can double only 1 time and when party starts
    }
    playerCards.push(cardsArray[dealCard()]);
    $("#player").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + playerCards[playerCards.length-1][1] + '.png"/>');
    updatePlayerPoints();
    animateCard();
    checkParty();
}

// Player double -> so he draw only 1 card and double the bet
function playerDouble()
{
    playerMoney -= playerBet;
    playerBet += playerBet;
    $("#playerMoney").text(playerMoney);
    playerDraw();

    // Bank don't need to draw if player busts
    if (finished == false)
    {
        bankDraw();    
    }
}

// Prepare deck (52 cards) for Blackjack with all needed values for the game
// Array from 1 to 52 cases
// In each case an another array containing [Card name][Card id][PointsA][PointsB]
// Remarks :	card names are in same order that png card images
function setDeck()
{	
    var deck = new Array();
    // High cards Aces (A) -> 11 or 1 points (points are managed in calculatePlayerPoints and calculateBankPoints methods)
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
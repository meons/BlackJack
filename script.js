// Global variables
var cardsArray;
var totalCardsDrawed;

var playerCards;
var playerPoints;
var playerMoney;

var bankCards;
var bankPoints;

// Play a card animation with Circulate library
function animateCard()
{
	$("#" + totalCardsDrawed).circulate({
				speed: 200,
				height: 150,
				width: 150
			});
}

// TEMP - Show Ace card
function showAce()
{
	$("#image").attr("src","classic-cards/2.png");
}

// TEMP - Show King card
function showKing()
{
	$("#image").attr("src","classic-cards/7.png");
}

// TEMP - Show random card
function showRandomCard()
{
	var card = Math.floor((Math.random() * 52) + 1);
	$("#image").attr("src","classic-cards/" + card + ".png");
}

// Deal a card ==> Return a random value between 1 and 52 to select a random card from cardsArray (pre-created with setDeck method)
function dealCard()
{
	totalCardsDrawed++;
	return Math.floor((Math.random() * 52) + 1);
	
}

// Start a new game
function newGame()
{	
	// Initialise all variables for all game
	cardsArray = setDeck();
	playerMoney = 1000;
	
	newParty();
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
	
	$("#bank").empty();
	$("#player").empty();
	
	bankDraw();
	playerDraw();
	playerDraw();
}

// Bank draw a card
function bankDraw()
{	
	bankCards.push(cardsArray[dealCard()]);
	$("#bank").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + bankCards[bankCards.length-1][1] + '.png"/>');
	bankPoints += bankCards[bankCards.length-1][2];
	$("#bankScore").text(bankPoints);
	
	animateCard();
}

// Player draw a card
function playerDraw()
{	
	playerCards.push(cardsArray[dealCard()]);
	$("#player").append('<img id="' + totalCardsDrawed + '" src="classic-cards/' + playerCards[playerCards.length-1][1] + '.png"/>');
	playerPoints += playerCards[playerCards.length-1][2];
	$("#playerScore").text(playerPoints);
	
	animateCard();
		
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
	deck[1] = new Array("Ac", 1, 11, 1);
	deck[2] = new Array("As", 2, 11, 1);
	deck[3] = new Array("Ah", 3, 11, 1);
	deck[4] = new Array("Ad", 4, 11, 1);
	
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
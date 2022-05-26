// import { Player } from "./Player"

const playerCards = document.querySelector('.playersCards')
const playerPoints = document.querySelector('.playerPoints')
const dealerCards = document.querySelector('.dealersCards')
const dealerPoints = document.querySelector('.dealerPoints')

const btnHit = document.querySelector('.hit')
const btnStand = document.querySelector('.stand')

const msgFinish = document.querySelector('.message')
const btnNewGame = document.querySelector('.new-game')

const Weights = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

const Types = ['spades', 'hearts', 'diamonds', 'clubs']

const typesToSign = {
	hearts: '♥',
	spades: '♠',
	diamonds: '♦',
	clubs: '♣',
}

// -----------------------------------------
// Tworzymy pustą talię
const cards = []

//------------------------------------------

// Tworzymy kartę
class Card {
	constructor(weight, type) {
		this.weight = weight
		this.type = type
	}
}

// Dodawanie karty do HTML
const renderCards = cardDrawn => {
	const card = document.createElement('div')
	card.setAttribute('class', `card ${cardDrawn.type}`)
	card.innerHTML = `${typesToSign[cardDrawn.type]}`

	card.dataset.value = `${cardDrawn.weight}${typesToSign[cardDrawn.type]}`
	return card
}

//------------------------------------------

// Przechodzimy po tablicy "Weights" oraz "Types" i łączymy we wszystkich kombinacjach (52) po czym dodajemy do talii
Types.forEach(type => Weights.forEach(weight => cards.push(new Card(weight, type))))

// console.log(cards);
// cards = 52 kartowa talia
//------------------------------------------
//------------------------------------------

// "Tasujemy" "cards"
const shuffle = () => {
	for (let i = cards.length - 1; i > 0; i--) {
		const randomCard = Math.floor(Math.random() * i)
		const temporary = cards[i]
		cards[i] = cards[randomCard]
		cards[randomCard] = temporary
	}
	return cards
}

// console.log(shuffle());
// i zwracamy "cards" "potasowane"
//------------------------------------------

// GRACZ
// const player = [{
// 	hand: []
// }]

const handPlayer = []
const handDealer = []
// console.log(handPlayer)

// console.log(handPlayer[0]);
// console.log(handPlayer[0].type);
// const test = () => {
// 	return 2;
// }

// console.log(handPlayer.filter(test));
// console.log(handPlayer[0].type);

// const countPts = (type) => {
// 	return handPlayer.filter(card => card.type == type).lenght
// }
// countPts('spades')

// handPlayer.forEach(card => {console.log(card)})

// console.log(countPts());
// const hand = []
let pointsPlayer = 0
let pointsDealer = 0

//------------------------------------------

// Bierzemy jedną kartę z góry i zwracamy ją
const pickOne = () => {
	return cards.shift()
}
//------------------------------------------

// RĘKA - dodawanie kart
// Jednak chyba nie potrzebuję tej funkcji
// const addCard = card => {
// 	 return hand.push(card)
// }
//------------------------------------------

// ROZDAWANIE KART na starcie
const dealCards = () => {
	for (let n = 0; n < 2; n++) {
		const card1 = pickOne()
		// const hand = addCard(card1)
		handPlayer.push(card1)
		playerCards.appendChild(renderCards(card1))

		const card2 = pickOne()
		// addCard(card2)
		handDealer.push(card2)
		dealerCards.appendChild(renderCards(card2))
		// console.log(handDealer);
	}

	// const pointsHand = handPlayer.map(pts => {
	// 	if (['K', 'Q', 'J'].includes(pts.weight)) {
	// 		return 10
	// 	}

	// 	if (handPlayer.length == 2 && pts.weight == 'A') {
	// 		return 11
	// 	}

	// 	if (handPlayer.length > 2 && pts.weight == 'A') {
	// 		return 11
	// 	}

	// 	return parseInt(pts.weight)

	// })

	// pointsPlayer = pointsHand.reduce(function (sum, weight) {
	// 	return parseInt(sum) + parseInt(weight)
	// })

	// console.log(pointsPlayer);
	// return pointsPlayer
}

const countCardsByWeight = (weight, hand) => {
	return hand.filter(card => card.weight == weight).length
}

const pointsHand = indicatedHand => {
	if (countCardsByWeight('A', indicatedHand) == 2 && indicatedHand.lenght == 2) {
		return 21
	}

	const pointsHand = indicatedHand.map(pts => {
		if (['K', 'Q', 'J'].includes(pts.weight)) {
			return 10
		}

		if (indicatedHand.length == 2 && pts.weight == 'A') {
			return 11
		}

		if (indicatedHand.length > 2 && pts.weight == 'A') {
			return 1
		}

		return parseInt(pts.weight)
	})

	pointsPlayer = pointsHand.reduce(function (sum, weight) {
		return parseInt(sum) + parseInt(weight)
	})

	return pointsPlayer
}

const playerDrawsCard = () => {
	if (pointsHand(handPlayer) <= 21) {
		const newCard = pickOne()
		handPlayer.push(newCard)
		playerCards.appendChild(renderCards(newCard))

		const ptsAfterNewCard = pointsHand(handPlayer)
		playerPoints.innerHTML = ptsAfterNewCard
	}

	if (pointsHand(handPlayer) > 21) {
		msgFinish.innerHTML = 'WygrywaDealer'
		msgFinish.style.display = 'block'
		btnNewGame.style.display = 'block'
		btnHit.style.display = 'none'
		btnStand.style.display = 'none'
	}
}

const dealerPlay = () => {
	while (
		pointsHand(handDealer) <= pointsHand(handPlayer) &&
		pointsHand(handDealer) < 21 &&
		pointsHand(handPlayer) <= 21
	) {
		const newCard = pickOne()
		handDealer.push(newCard)
		dealerCards.appendChild(renderCards(newCard))

		const ptsAfterNewCard = pointsHand(handDealer)
		dealerPoints.innerHTML = ptsAfterNewCard
	}

	endGame()
}

const endGame = () => {
	btnHit.style.display = 'none'
	btnStand.style.display = 'none'

	if (pointsHand(handPlayer) <= 21 && pointsHand(handPlayer) == pointsHand(handDealer)) {
		msgFinish.innerHTML = 'Remis'
		msgFinish.style.display = 'block'
		btnNewGame.style.display = 'block'

		return
	}

	if (pointsHand(handDealer) > 21) {
		msgFinish.innerHTML = 'WYGRYWASZ'
		msgFinish.style.display = 'block'
		btnNewGame.style.display = 'block'

		return
	}

	if (pointsHand(handPlayer) < pointsHand(handDealer)) {
		msgFinish.innerHTML = 'Wygrywa Dealer'
		msgFinish.style.display = 'block'
		btnNewGame.style.display = 'block'

		return
	}
}

//------------------------------------------

const startGame = () => {
	// Chyba lepiej będzie jak "przechodzenie po tablicy" zrobi się w funkcji i doda jej wywołanie tutja na początek
	shuffle()
	dealCards()

	const calcPlayerPoints = pointsHand(handPlayer)
	const calcDealerPoints = pointsHand(handDealer)

	playerPoints.innerHTML = calcPlayerPoints
	dealerPoints.innerHTML = calcDealerPoints
}

startGame()

btnHit.addEventListener('click', playerDrawsCard)
btnStand.addEventListener('click', dealerPlay)
//------------------------------------------

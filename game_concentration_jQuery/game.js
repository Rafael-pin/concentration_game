const images = [
  "./images/image1.jpg",
  "./images/image2.jpg",
  "./images/image3.jpg",
  "./images/image4.jpg",
  "./images/image5.jpg",
  "./images/image6.jpg",
  "./images/image7.jpg",
  "./images/image8.jpg",
  "./images/image9.jpg",
  "./images/image10.jpg"
];
const name = new URLSearchParams(window.location.search).get('name');
const numberOfPieces = Number(new URLSearchParams(window.location.search).get('pieces'));
const positions = shuffle([...Array(numberOfPieces).keys()]);
let rounds = 0;
let tableBody = $("tbody");
let pieces = []
let turnedPieces = 0;
let lastTurnedPieceId = -1;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

function createPieces() {
  let id = -1;
  let shouldUpdateId = true;
  for (let i = 0; i < numberOfPieces; i++) {
    id += getId(shouldUpdateId)
    shouldUpdateId = !shouldUpdateId;
    const randomNumber = positions[i];
    const piece = {
      id: id,
      position: randomNumber,
      image: images[id],
      isTurned: false
    }

    pieces.push(piece);
  }
}

function getId(shouldUpdateId) {
  return shouldUpdateId ? 1 : 0
}

function createTable() {
  let content = "<tr>";
  for (let i = 0; i < numberOfPieces; i++) {
    const position = pieces[i].position;
    if(i === 0 || i % 4 === 0) {content += "<tr>";};
    content +=
      "<td><img alt='image for the game' name='" + position + "' id='" + pieces[position].id + "' src='./images/logo.png'>"
  }
  tableBody.append(content);
}

function turnPiece() {
  $('img').click(function() {
    turnedPieces++
    if(turnedPieces <= 2) {
      countRounds();
      let id = Number(this.id);
      const pieceIndex = pieces.findIndex(piece => piece.id === id);
      $(this).attr('src' , images[id]);
      if (lastTurnedPieceId === id) {
        makePoint(id);
        finishGame();
      }
      lastTurnedPieceId = id;
    } else {
      resetPieces();
    }
  })
}

function resetPieces() {
  const unTurnedIds = getUntTurnedIds();
  for(let id of unTurnedIds) {
    $('[name="' + Number(id) + '"]').attr("src", "./images/logo.png");
  }
  lastTurnedPieceId = -1;
  turnedPieces = 0
}

function getUntTurnedIds() {
  let unTurnedIds = [];
  for(let i = 0; i < pieces.length; i++) {
    if(!pieces[i].isTurned) {
      unTurnedIds.push(i);
    }
  }
  return unTurnedIds;
}

function makePoint(id) {
  for (let i = 0; i < pieces.length; i++) {
    if(pieces[i].id === id) {
      pieces[i].isTurned = true;
    }
  }
  lastTurnedPieceId = -1;
  turnedPieces = 0;
}

function finishGame() {
  for (let i = 0; i < pieces.length; i++) {
    if(!pieces[i].isTurned) {
      return
    }
  }
  alert("Congratulations " + name +"! You win in " + rounds + " rounds!");
  window.location.replace("./menu.html");
}

function countRounds() {
    rounds++;
    $('h5').text("Number of plays: " + rounds);
}

function startGame() {
  createPieces();
  createTable();
  turnPiece();
}

startGame()

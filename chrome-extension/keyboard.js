chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "typeWord") {
    typeWord(request.word);
  }
});

const typeWord = (word) => {
  const letters = word.split("");

  letters.forEach((letter) => {
    clickKeyboardLetter(letter);
  });

  clickKeyboardLetter("↵");
}

const clickKeyboardLetter = (letter) => {
  document
    .querySelector("game-app")
    .shadowRoot.querySelector("game-keyboard")
    .shadowRoot.querySelector(`button[data-key='${letter}']`)
    .click();
};
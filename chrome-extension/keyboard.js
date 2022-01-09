function clickKeyboardLetter(letter) {
    document.querySelector("game-app").shadowRoot.querySelector("game-keyboard").shadowRoot.querySelector(`button[data-key='${letter}']`).click();
}

function typeWord(word) {
    const letters = word.split('');
  
    letters.forEach(letter => {
      clickKeyboardLetter(letter);
    });
}
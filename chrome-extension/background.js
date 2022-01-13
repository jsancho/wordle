function typeWord(word) {
  const clickKeyboardLetter = (letter) => {
    document
      .querySelector("game-app")
      .shadowRoot.querySelector("game-keyboard")
      .shadowRoot.querySelector(`button[data-key='${letter}']`)
      .click();
  };

  const letters = word.split("");

  letters.forEach((letter) => {
    clickKeyboardLetter(letter);
  });

  // clickKeyboardLetter("↵");
}

// extension init
chrome.runtime.onInstalled.addListener(() => {
  // irate, arose, adieu
  const initialWord = "irate";
  chrome.storage.sync.set({ initialWord });
  console.log(`Wordle cracker initialised with ${initialWord}`);
});

// extension icon has been clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(
    tab.id,
    { action: "parseHtml" },
    onGameResultsReceived
  );
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   debugger;
//   console.log(
//     sender.tab
//       ? "from a content script:" + sender.tab.url
//       : "from the extension"
//   );
//   if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
// });

const onGameResultsReceived = (gameResults) => {
  const { hint } = gameResults;
  console.log(gameResults);

  if (!hint.includes("*")) {
    console.log("game solved!");
    return;
  }

  sendMessageToActiveTab(
    { action: "suggestWord", gameResults },
    onNextWordSuggested
  );
};

const onNextWordSuggested = (word) => {
  debugger;

  // TODO: this callback is received before the getSuggestions promise is resolved
  // type word
  console.log("typing... " + word);
};

const sendMessageToActiveTab = (action, onResponseReceived) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, action, onResponseReceived);
  });
};

// extension icon has been clicked
// chrome.action.onClicked.addListener(tab => {
// if (tab.url.includes("https://www.powerlanguage.co.uk/wordle/")){

// get value from storage
// chrome.storage.sync.get("wordle", ({ color }) => {
//   document.body.style.backgroundColor = color;
// });

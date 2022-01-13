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
  console.log("typing... " + word);

  sendMessageToActiveTab({action: "typeWord", word});

  // TODO: parse results again
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

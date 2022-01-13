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

const getSuggestions = async (results) => {
  const requestDictionary = async () => {
    try {
      const file = chrome.runtime.getURL("wordle.txt");
      return fetch(file).then((response) => response.text());
    } catch (error) {
      console.log(error);
    }
  };

  const filterIncludedLetters = (dictionary, include) => {
    if (!include?.length) return dictionary;
    let wordTokens = dictionary.split(",");

    const chars = include.split("");
    // TODO: remove duplicate letters
    chars.forEach((char) => {
      wordTokens = wordTokens.filter((w) => w.includes(char));
    });

    return wordTokens.join(",");
  };

  const filterExcludedLetters = (dictionary, exclude) => {
    if (!exclude?.length) return dictionary;
    let wordTokens = dictionary.split(",");

    const chars = exclude.split("");
    // TODO: remove duplicate letters
    chars.forEach((char) => {
      wordTokens = wordTokens.filter((w) => !w.includes(char));
    });

    return wordTokens.join(",");
  };

  const matchResultsToDictionary = async (results, dictionary) => {
    let workingDictionary = filterIncludedLetters(dictionary, results.include);
    workingDictionary = filterExcludedLetters(dictionary, results.exclude);

    const hintMatcher = results.hint.replace(/\*/g, "[a-z]");
    const wordMatcherExpression = `(${hintMatcher}),`;
    const wordMatcher = new RegExp(wordMatcherExpression, "g");
    const result = [...workingDictionary.matchAll(wordMatcher)];

    return result.map((r) => r[1]);
  };

  const dictionary = await requestDictionary();
  const matches = await matchResultsToDictionary(results, dictionary);

  debugger;
  return matches;
};

const getMatchResults = (tab) => {
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      function: getSuggestions,
    })
    .then((data) => {
      debugger;
      return data[0].result;
    });
};

// extension init
chrome.runtime.onInstalled.addListener(() => {
  // irate, arose, adieu
  const initialWord = "irate";
  chrome.storage.sync.set({ initialWord });
  console.log(`Wordle cracker initialised with ${initialWord}`);
});

const onGameResultsReceived = (results) => {
  const { hint } = results;
  console.log(results);

  if (!hint.includes("*")) {
    console.log("game solved!");
    // return;
  }
};

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(
    tab.id,
    { action: "parseHtml" },
    onGameResultsReceived
  );
});

// extension icon has been clicked
// chrome.action.onClicked.addListener(tab => {
// if (tab.url.includes("https://www.powerlanguage.co.uk/wordle/")){

// get value from storage
// chrome.storage.sync.get("wordle", ({ color }) => {
//   document.body.style.backgroundColor = color;
// });

/*getGameResults(tab).then(results => {
      const { hint } = results;

      if (!hint.includes('*')) {
        console.log("game solved!");
        // return;
      }

      // getMatchResults(tab).then(matches => {
      //   debugger;
      //   console.log("matched words");
      //   console.log(matches);
      // })

    })
    .catch(error => {
      debugger;
      console.error(error.message);
    })*/

// const here = await getGameResults(tab);

// Try hint
// const args = "radio";
// chrome.scripting.executeScript({
//   target: { tabId: tab.id },
//   function: typeWord,
//   args: [args]
// });

// }
// });

// global variable, so that we can load the dictionary at script injection
let dictionary = "";

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "suggestWord") {
    const suggestions = getSuggestions(request.gameResults, dictionary);

    // TODO: instead of returning first match, use an strategy,
    // e.g.
    // - word that will eliminate the most characters (count of more different characters)
    // - word that will eliminate the most characters (word more "different" to every other word)
    // - word with the most commonality (use a popularity ratio based on freedictionary.com, merriamwebster?)
    const topSuggestion = suggestions[0];
    sendResponse(topSuggestion);

    // return true from the event listener to indicate you wish to send a response asynchronously
    // (this will keep the message channel open to the other end until sendResponse is called).
    return true;
  }
});

const filterIncludedLetters = (dictionary, include) => {
  if (!include?.length) return dictionary;
  const wordTokens = dictionary.split(",");

  const filtered = wordTokens.reduce((previous, current) => {
    const containsAllLetters = include.every((c) => current.includes(c));
    return containsAllLetters ? [...previous, current] : previous;
  }, []);

  return filtered.join(",");
};

const filterExcludedLetters = (dictionary, exclude) => {
  if (!exclude?.length) return dictionary;
  let wordTokens = dictionary.split(",");

  exclude.forEach((char) => {
    wordTokens = wordTokens.filter((w) => !w.includes(char));
  });

  return wordTokens.join(",");
};

const getSuggestions = (results, dictionary) => {
  const { hint, include, exclude, misses } = results;

  let workingDictionary = filterIncludedLetters(dictionary, include);
  workingDictionary = filterExcludedLetters(workingDictionary, exclude);

  const characterMatcher = hint
    .map((c, i) => {
      if (c !== "*") return c;

      return misses[i].length ? `[^${misses[i].join("")}]` : "[a-z]";
    })
    .join("");

  const wordMatcherExpression = `(${characterMatcher}),`;
  const wordMatcher = new RegExp(wordMatcherExpression, "g");
  const result = [...workingDictionary.matchAll(wordMatcher)];

  return result.map((r) => r[1]);
};

const requestDictionary = () => {
  const file = chrome.runtime.getURL("wordle.txt");

  fetch(file)
    .then((response) => response.text())
    .then((text) => {
      dictionary = text;
    })
    .catch((error) => {
      console.log(error);
    });
};
requestDictionary();

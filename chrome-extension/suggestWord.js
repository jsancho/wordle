// global variable, so that we can load the dictionary during script injection
let dictionary = [];

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "suggestWord") {
    const { gameResults } = request;
    const suggestions = getSuggestions(gameResults, dictionary);

    console.log(`${suggestions.length} suggestions found...`);
    console.log(JSON.stringify(suggestions));

    const topScoreSuggestion = getTopScore(suggestions, gameResults);

    sendResponse(topScoreSuggestion);

    // return true from the event listener to indicate you wish to send a response asynchronously
    // (this will keep the message channel open to the other end until sendResponse is called).
    return true;
  }
});

const getTopScore = (suggestions, gameResults) => {
  // match the letters that we can still use and that have not been found yet (in yellows nor greens)
  const validLettersExpression = `([^${gameResults.include.join("")}])`;
  const validLettersMatcher = new RegExp(validLettersExpression, "g");

  // we calculate the score of every letter that can be potentially used.
  // every appearence of a letter in a word will increase its score by one
  const scoredLetters = {};
  suggestions.forEach((word) => {
    const lettersToScore = word.match(validLettersMatcher) || [];

    lettersToScore.forEach((letter) => {
      scoredLetters[letter] = scoredLetters[letter]
        ? scoredLetters[letter] + 1
        : 1;
    });
  });

  const scoredWords = suggestions.map((word) => {
    const letters = word.split("");

    // get the score of every letter and add it up
    const score = letters.reduce((previous, current) => {
      return previous + (scoredLetters[current] || 0);
    }, 0);

    return {
      word,
      score,
    };
  });

  const sortedWords = [...scoredWords].sort((a, b) => {
    return b.score - a.score;
  });

  // lowest score
  //return sortedWords[sortedWords.length - 1].word;

  //highest score
  return sortedWords[0].word;
};

const filterIncludedLetters = (dictionary, include) => {
  if (!include?.length) return dictionary;

  return dictionary.reduce((previous, current) => {
    const containsAllLetters = include.every((c) => current.includes(c));
    return containsAllLetters ? [...previous, current] : previous;
  }, []);
};

const filterExcludedLetters = (dictionary, exclude) => {
  if (!exclude?.length) return dictionary;
  let words = [...dictionary];

  exclude.forEach((char) => {
    words = words.filter((w) => !w.includes(char));
  });

  return words;
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

  const dictionaryString = workingDictionary.join(",") + ",";
  const result = [...dictionaryString.matchAll(wordMatcher)];

  return result.map((r) => r[1]);
};

const requestDictionary = () => {
  const file = chrome.runtime.getURL("wordle.txt");

  fetch(file)
    .then((response) => response.text())
    .then((text) => {
      dictionary = JSON.parse(text);
    })
    .catch((error) => {
      console.log(error);
    });
};
requestDictionary();

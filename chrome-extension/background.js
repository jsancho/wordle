function typeWord(word) {
  const clickKeyboardLetter = (letter) => {
    document.querySelector("game-app").shadowRoot
    .querySelector("game-keyboard")
    .shadowRoot
    .querySelector(`button[data-key='${letter}']`)
    .click();
  }

  const letters = word.split('');

  letters.forEach(letter => {
    clickKeyboardLetter(letter);
  });

  // clickKeyboardLetter("↵");
}

function getYellowLetters() {
  // const allRows = document.querySelector("game-app").shadowRoot
  //     .querySelectorAll("game-row");

  const usedRows = document.querySelector("game-app").shadowRoot
      .querySelectorAll("game-row[letters]:not([letters=''])");

  let presentLetters = [];
  // TODO: refactor to use a reduce method?
  usedRows.forEach(row => {
      const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='present']");
      const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
      presentLetters = [...presentLetters, ...letters];
  });
  
  return [...new Set(presentLetters)];
}

function getGreyLetters() {
  const usedRows = document.querySelector("game-app").shadowRoot
      .querySelectorAll("game-row[letters]:not([letters=''])");

  let absentLetters = [];
  // TODO: refactor to use a reduce method?
  usedRows.forEach(row => {
      const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='absent']");
      const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
      absentLetters = [...absentLetters, ...letters];
  });
  
  return [...new Set(absentLetters)];
}

function getGreenLetters() {
  const usedRows = document.querySelector("game-app").shadowRoot
      .querySelectorAll("game-row[letters]:not([letters=''])");

  let absentLetters = [];
  // TODO: refactor to use a reduce method?
  usedRows.forEach(row => {
      const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='correct']");
      const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
      absentLetters = [...absentLetters, ...letters];
  });
  
  return [...new Set(absentLetters)];
}


const parseResults = async (tab) => {
  const yellow = chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getYellowLetters,
  })
  .then(data => { 
    return { 
      name : "yellow", 
      values : data[0].result 
    }}
  );

  const grey = chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getGreyLetters,
  })
  .then(data => { 
    return { 
      name : "grey", 
      values : data[0].result 
    }}
  );

  const green = chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getGreenLetters,
  })
  .then(data => { 
    return { 
      name : "green", 
      values : data[0].result 
    }}
  );

  return await Promise.all([yellow, grey, green]);
};

// extension init
chrome.runtime.onInstalled.addListener(() => {
  const initialWord = "irate";
  chrome.storage.sync.set({ initialWord });
  console.log(`Wordle cracker initialised with ${initialWord}`);
});

// clicking on extension icon
chrome.action.onClicked.addListener(tab => {
  if (tab.url.includes("https://www.powerlanguage.co.uk/wordle/")){

    // get from storage
    // chrome.storage.sync.get("wordle", ({ color }) => {
    //   document.body.style.backgroundColor = color;
    // });

    // TODO: parse results from attempt
    // const yellow = chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ['results.js']
    // });
    parseResults(tab).then(values => {
      debugger;
      console.log(values);
    })
    .catch(error => {
      debugger;
      console.error(error.message);
    })

    // console.log(JSON.stringify(yellow));

    // TODO: get dictionary hint

    
    // Try hint
    // const args = "radio";
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: typeWord,
    //   args: [args]
    // });

    

    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ['keyboard.js']
    // });

  }
});
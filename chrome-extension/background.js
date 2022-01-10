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

function parseHtmlTileResults() {
  const usedRows = document.querySelector("game-app").shadowRoot
      .querySelectorAll("game-row[letters]:not([letters=''])");

  const hint = Array.from('*'.repeat(5))
  let yellow = {};
  const exclude = [];
  
  usedRows.forEach(row => {
    const t = row.shadowRoot.querySelectorAll("game-tile")
      const tiles = Array.from(t);

      for (let i = 0; i<5; i++){
        const letter = tiles[i].getAttribute("letter");
        const evaluation = tiles[i].getAttribute("evaluation");
        
        switch (evaluation) {
          case "correct": hint.splice(i, 1, letter);
                          break;
          case "present": yellow[letter] = yellow[letter] && yellow[letter].length ? [...yellow[letter],i] :[i];
                         break;
          case "absent": exclude.push(letter);
                         break;
        }
      }
  });

  // TODO: remove duplicates from yellow positions
  const result = {
    hint: hint.join(''),
    yellow,
    exclude: [...new Set(exclude)]
  }
  
  return result;
}

const getSuggestions = async (results) => {
  const parseDictionary = (dictionary) => {

    debugger;
  }

  const requestDictionary = async () => {

    try {
    
      const file = chrome.runtime.getURL('wordle.txt');
      debugger;
      const data = await fetch(file).then(response => response.text());
      
      console.log(data.split(',').length + ' words');
    }
    catch(error) {
      console.log(error);
    }
  }

  await requestDictionary();
}

const getGameResults = async (tab) => {
  return chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: parseHtmlTileResults,
  })
  .then(data => data[0].result);
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

    // run external script
    // const yellow = chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ['results.js']
    // });

    // TODO: parse results from previous attempts
    getGameResults(tab).then(results => {
      const { hint } = results;

      console.log(results);

      if (!hint.includes('*')) {
        console.log("game solved!");
        // return;
      }

      // TODO: get dictionary hint, logic from node module

      // getSuggestions();

      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: getSuggestions,
          args: [results]
      });

    })
    .catch(error => {
      debugger;
      console.error(error.message);
    })
    
    
    // Try hint
    // const args = "radio";
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: typeWord,
    //   args: [args]
    // });

  }
});
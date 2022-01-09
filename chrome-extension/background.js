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

  // TODO: remove duplicates from exclude
  // TODO: remove duplicates from yellow positions
  return { hint: hint.join(''), yellow, exclude};
}

// function getYellowLetters() {
//   // const allRows = document.querySelector("game-app").shadowRoot
//   //     .querySelectorAll("game-row");

//   const usedRows = document.querySelector("game-app").shadowRoot
//       .querySelectorAll("game-row[letters]:not([letters=''])");

//   let result = [];
//   // TODO: refactor to use a reduce method?
//   usedRows.forEach(row => {
//       const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='present']");
//       const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
//       result = [...result, ...letters];
//   });
  
//   return [...new Set(result)];
// }

// function getGreyLetters() {
//   const usedRows = document.querySelector("game-app").shadowRoot
//       .querySelectorAll("game-row[letters]:not([letters=''])");

//   let result = [];
//   // TODO: refactor to use a reduce method?
//   usedRows.forEach(row => {
//       const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='absent']");
//       const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
//       result = [...result, ...letters];
//   });
  
//   return [...new Set(result)];
// }

// function getGreenLetters() {
//   const usedRows = document.querySelector("game-app").shadowRoot
//       .querySelectorAll("game-row[letters]:not([letters=''])");

//   let result = [];
//   // TODO: refactor to use a reduce method?
//   usedRows.forEach(row => {
//       const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='correct']");
//       const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
//       result = [...result, ...letters];
//   });
  
//   return [...new Set(result)];
// }


const getGameResults = async (tab) => {
  return chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: parseHtmlTileResults,
  })
  .then(data => data[0].result);

  // const yellow = chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: getYellowLetters,
  // })
  // .then(data => { 
  //   return { 
  //     name : "yellow", 
  //     values : data[0].result 
  //   }}
  // );

  // const grey = chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: getGreyLetters,
  // })
  // .then(data => { 
  //   return { 
  //     name : "grey", 
  //     values : data[0].result 
  //   }}
  // );

  // const green = chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: getGreenLetters,
  // })
  // .then(data => { 
  //   return { 
  //     name : "green", 
  //     values : data[0].result 
  //   }}
  // );

  // return await Promise.all([all, yellow, grey, green]);
  // return results;
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
    getGameResults(tab).then(results => {
      console.log(results);
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
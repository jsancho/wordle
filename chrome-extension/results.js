function getYellowLetters() {
    const allRows = document.querySelector("game-app").shadowRoot
        .querySelectorAll("game-row");

    const usedRows = document.querySelector("game-app").shadowRoot
        .querySelectorAll("game-row[letters]:not([letters=''])");

    let presentLetters = [];
    // TODO: refactor to use a reduce method?
    usedRows.forEach(row => {
        const presentTiles = row.shadowRoot.querySelectorAll("game-tile[evaluation='present']");
        const letters = Array.from(presentTiles).map(tile => tile.getAttribute("letter"));
        presentLetters = [...presentLetters, ...letters];
    });
    
    const result = [...new Set(presentLetters)];
    console.log(JSON.stringify(result));

    return result;
}

getYellowLetters();
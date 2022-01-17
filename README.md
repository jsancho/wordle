# WORDLE CRACKER

The main project is a Google Chrome extension that guesses the next best word to use on every click.
![](https://github.com/jsancho/wordle-cracker/blob/main/media/game_solved_tangy.gif)

## Install the extension

- Navigate to chrome://extensions
- Expand the Developer dropdown menu and click “Load Unpacked Extension”
- Navigate to the local folder containing the extension’s code and click Ok
- Click on the puzzle icon to show all extensions installed
- Click on the thumbtack next to 'Wordle Cracker` to fix it to the right of the search bar.

## Instructions

Go to https://www.powerlanguage.co.uk/wordle

Start by typing your word of choice.
My recommendation is to use a word that has a good mix of vowels and common consonants, e.g. stare, irate, arose, adieu

Then either make your own guess or click on the extension icon to make it automatically type a good guess that follows the "hard mode" rules.

## Node project

This project can be used to generate dictionaries in a JSON format that the chrome extension can use.
It can also be used as a `cli` to interactively get word guesses from the command line.

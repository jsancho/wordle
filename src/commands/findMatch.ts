import { promises as fs } from 'fs';
import { EOL } from 'os';

// TODO: use npm "conf to store global settings"
const WORDLE_DICTIONARY = 'wordle.txt';
const WORD_LENGTH = 5;

export const findMatch = async (hint: string) => {
  if (hint.length !== WORD_LENGTH) {
    printBadHintError();
    // hint = 'ant**';
  }
  console.log(`finding matches for ${hint}`);

  const dictionary = await loadDictionary();

  const hintMatcher = hint.replace(/\*/g, '[a-z]');
  const wordMatcherExpression = `(${hintMatcher}),`;
  const wordMatcher = new RegExp(wordMatcherExpression, 'g');

  const result = [...dictionary.matchAll(wordMatcher)];

  console.log(`${result.length} match(es) found`);

  result.forEach((suggestion) => console.log(suggestion[1]));
};

const printBadHintError = () => {
  console.error(`the hint must have ${WORD_LENGTH} characters`);
  console.error(
    'For example, use app*e to match the word with any character in the 4th position'
  );
};

const loadDictionary = async () => {
  return fs.readFile(`${__dirname}/../dicts/${WORDLE_DICTIONARY}`, {
    encoding: 'utf8',
  });
};

import { promises as fs } from 'fs';

// TODO: use npm "conf" to store global settings
const WORDLE_DICTIONARY = 'wordle.txt';
const WORD_LENGTH = 5;

interface IOptions {
  include: string;
  exclude: string;
}

export const findMatch = async (hint: string, options: IOptions) => {
  if (hint.length !== WORD_LENGTH) {
    printBadHintError();
  }

  printStart(hint, options);

  const dictionary = await loadDictionary(options);
  const matches = await matchWords(hint, dictionary);

  printResult(matches);
};

const matchWords = async (hint: string, dictionary: string) => {
  const hintMatcher = hint.replace(/\*/g, '[a-z]');
  const wordMatcherExpression = `(${hintMatcher}),`;
  const wordMatcher = new RegExp(wordMatcherExpression, 'g');
  const result = [...dictionary.matchAll(wordMatcher)];

  return result.map((r) => r[1]);
};

const printBadHintError = () => {
  console.error(`the hint must have ${WORD_LENGTH} characters`);
  console.error(
    'For example, use "app*e" to match the word with a wildcar in the 4th letter'
  );
};

const printStart = (hint: string, options: IOptions) => {
  console.log(`finding matches for ${hint}`);
  if (options.include?.length)
    console.log(`including ${JSON.stringify(options.include)}`);

  if (options.exclude?.length)
    console.log(`excluding ${JSON.stringify(options.exclude)}`);
};

const printResult = (result: string[]) => {
  console.log(`${result.length} match(es) found`);
  result.forEach((suggestion) => console.log(suggestion));
};

const loadDictionary = async (options: IOptions) => {
  let dictionary = await fs.readFile(
    `${__dirname}/../dicts/${WORDLE_DICTIONARY}`,
    {
      encoding: 'utf8',
    }
  );

  dictionary = filterIncludedLetters(dictionary, options.include);
  dictionary = filterExcludedLetters(dictionary, options.exclude);

  return dictionary;
};

const filterIncludedLetters = (dictionary: string, include: string) => {
  if (!include?.length) return dictionary;
  let wordTokens = dictionary.split(',');

  const chars = include.split('');
  // TODO: remove duplicate letters
  chars.forEach((char) => {
    wordTokens = wordTokens.filter((w) => w.includes(char));
  });

  return wordTokens.join(',');
};

const filterExcludedLetters = (dictionary: string, exclude: string) => {
  if (!exclude?.length) return dictionary;
  let wordTokens = dictionary.split(',');

  const chars = exclude.split('');
  // TODO: remove duplicate letters
  chars.forEach((char) => {
    wordTokens = wordTokens.filter((w) => !w.includes(char));
  });

  return wordTokens.join(',');
};

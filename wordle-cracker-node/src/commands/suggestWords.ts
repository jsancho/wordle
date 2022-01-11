import { promises as fs } from 'fs';
import { findMatches } from './findMatches';

// TODO: use npm "conf" to store global settings
const WORDLE_DICTIONARY = 'wordle.txt';

export interface IOptions {
  include: string;
  exclude: string;
}

export const suggestWords = async (hint: string, options: IOptions) => {
  const dictionary = await loadDictionary(options);
  const suggestions = await findMatches(hint, options, dictionary);

  printResult(suggestions);
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

// TODO: use structured data + regex to match forbidden positions
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

const printResult = (result: string[]) => {
  console.log(`${result.length} match(es) found`);
  result.forEach((suggestion) => console.log(suggestion));
};

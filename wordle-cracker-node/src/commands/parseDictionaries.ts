import { promises as fs } from 'fs';
import { Buffer } from 'buffer';

const DEFAULT_DICTIONARY = 'SCRABBLE-munged-large.txt';
const WORDLE_DICTIONARY = 'wordle.txt';
const WORD_LENGTH = 5;

export interface IWord {
  word: string;
  uniqueness: number;
}

export const parseDictionaries = async () => {
  try {
    // TODO: Parse all available files in "dicts" as a single collection
    const data = await fs.readFile(
      `${__dirname}/../dicts/${DEFAULT_DICTIONARY}`,
      { encoding: 'utf8' }
    );

    // TODO: apply multiline regex before splitting the file
    const words = data.split(/\r?\n/);
    const wordValidator = new RegExp(`^[a-z]{${WORD_LENGTH}}$`);
    const wordsValidated = words
      .filter((word) => wordValidator.test(word))
      .map((word) => word.toLowerCase());

    const uniqueWords = [...new Set(wordsValidated)];

    await saveDictionary(uniqueWords);

    console.log(`${words.length} words have been found.`);
    console.log(
      `${uniqueWords.length} unique words with a length of ${WORD_LENGTH} have been filtered.`
    );
  } catch (error) {
    console.log('unable to process dictionary files');
    console.log(error);
  }
};

export const saveDictionary = async (words: string[]) => {
  const dictionary = words.map((word) => {
    return {
      word,
      uniqueness: word.length,
    } as IWord;
  });
  const json = JSON.stringify(dictionary);
  const writeBuffer = Buffer.from(json);
  await fs.writeFile(`${__dirname}/../dicts/${WORDLE_DICTIONARY}`, writeBuffer);
};

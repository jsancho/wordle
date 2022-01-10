import { promises as fs } from 'fs';
import { Buffer } from 'buffer';

const DEFAULT_DICTIONARY = 'SCRABBLE-munged-large.txt';
const WORDLE_DICTIONARY = 'wordle.txt';
const WORD_LENGTH = 5;

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

    console.log(`${words.length} words have been found.`);
    console.log(
      `${uniqueWords.length} unique words with a length of ${WORD_LENGTH} have been filtered.`
    );

    const csv = uniqueWords.join(',');
    const writeBuffer = Buffer.from(csv);
    await fs.writeFile(
      `${__dirname}/../dicts/${WORDLE_DICTIONARY}`,
      writeBuffer
    );
  } catch (error) {
    console.log('unable to process dictionary files');
    console.log(error);
  }
};

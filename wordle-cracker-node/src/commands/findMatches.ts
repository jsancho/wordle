import { IOptions } from './suggestWords';

const WORD_LENGTH = 5;

export const findMatches = async (
  hint: string,
  options: IOptions,
  dictionary: string
) => {
  if (hint.length !== WORD_LENGTH) {
    printBadHintError();
  }

  printStart(hint, options);
  return matchWords(hint, dictionary);
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

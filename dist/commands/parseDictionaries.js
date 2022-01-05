"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDictionaries = void 0;
const fs_1 = require("fs");
const buffer_1 = require("buffer");
const os_1 = require("os");
const DEFAULT_DICTIONARY = "SCRABBLE-munged-large.txt";
const WORDLE_DICTIONARY = "wordle.txt";
const WORD_LENGTH = 5;
const parseDictionaries = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Parse all available files in "dicts" as a single collection
    const data = yield fs_1.promises.readFile(`${__dirname}/../dicts/${DEFAULT_DICTIONARY}`, { encoding: "utf8" });
    const words = data.split(/\r?\n/);
    // TODO: regex to correct length and no numeric characters
    const expression = /^[a-z]{5}$/;
    const wordleDictionary = words.filter(word => expression.test(word)).map(word => word.toLowerCase());
    // const wordleDictionary = words
    //                         .filter(word => word.length === WORD_LENGTH)
    //                         .map(word => word.toLowerCase());
    console.log(`${words.length} have been found`);
    console.log(`${wordleDictionary.length} with length of ${WORD_LENGTH} have been filtered`);
    const writeBuffer = buffer_1.Buffer.from(wordleDictionary.join(os_1.EOL));
    yield fs_1.promises.writeFile(`${__dirname}/../dicts/${WORDLE_DICTIONARY}`, writeBuffer);
    // fs.readFile(`${__dirname}/../dicts/${DEFAULT_DICTIONARY}`,'utf8', (err, data)=> {
    // });
    // fs.writeFile(`${__dirname}/../dicts/${DEFAULT_DICTIONARY}`,'utf8', (err, data)=> {
    // });
});
exports.parseDictionaries = parseDictionaries;
//# sourceMappingURL=parseDictionaries.js.map
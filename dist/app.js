"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const findMatch_1 = require("./commands/findMatch");
const parseDictionaries_1 = require("./commands/parseDictionaries");
commander_1.program.command('suggest')
    .description('Suggest possible matching words')
    .action(findMatch_1.findMatch);
commander_1.program.command('parse-dicts')
    .description('Load a dictionary and reduce it to 5 characters only')
    .action(parseDictionaries_1.parseDictionaries);
commander_1.program.parse();
//# sourceMappingURL=app.js.map
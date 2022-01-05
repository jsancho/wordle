import { program } from "commander";
import { findMatch } from "./commands/findMatch";
import { parseDictionaries} from "./commands/parseDictionaries";

program.command('suggest')
        .description('Suggest possible matching words')
        .action(findMatch);

program.command('parse-dicts')
        .description('Load a dictionary and reduce it to 5 characters only')
        .action(parseDictionaries)

program.parse();
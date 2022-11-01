import * as fs from "fs"
import {TableParser} from "./TableParser/TableParser";
import {Config} from "./TableParser/Config";
import {DefaultConfigs} from "./DefaultConfigs";

const file = fs.readFileSync("resources/samples/28.json")
const parser = new TableParser(file, new Config(DefaultConfigs.Canvas, DefaultConfigs.Anchor))
parser.parse()
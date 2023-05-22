import * as fs from "fs"
import {TableParser} from "./TableParser/TableParser";
import {Config} from "./TableParser/Config";
import {DefaultConfigs} from "./DefaultConfigs";



const file = fs.readFileSync(`resources/m6/s0002.json`)
const parser = new TableParser(file, new Config(DefaultConfigs.Canvas, DefaultConfigs.Anchor))
const d = parser.parse()
fs.writeFileSync(`out/m6/${d.meta.room}.json`, JSON.stringify(d))

const testFolder = 'resources/m4';

fs.readdir(testFolder, (err, files) => {
    files.forEach(efile => {
        const file = fs.readFileSync(`${testFolder}/${efile}`)
        const parser = new TableParser(file, new Config(DefaultConfigs.Canvas, DefaultConfigs.Anchor))
        const d = parser.parse()
        fs.writeFileSync(`out/m4/${d.meta.room}.json`, JSON.stringify(d))
    });
});
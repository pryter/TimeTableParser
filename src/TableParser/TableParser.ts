import {RawData} from "../interfaces/RawData";
import {Config} from "./Config";
import {refine} from "./utils/refiner";
import {AlignedOrderedPairs} from "./utils/AlignedOrderedPairs";
import {DataProcessor} from "./utils/DataProcessor";

export class TableParser {
    public subjectContent: RawData<any>
    public config: Config

    constructor(file: Buffer,config: Config, initialLocator = (d: RawData<any>) => (d["responses"][0])) {
        try {
            const rawData = JSON.parse(file.toString())
            this.subjectContent = initialLocator(rawData)
            this.config = config
        } catch (e) {
            throw e
        }
    }

    public parse() {
        this.parseMeta()
        this.parseBody()
    }

    protected parseMeta() {

    }

    protected parseBody() {
        const data = this.subjectContent.textAnnotations

        // Shift first item
        data.shift()

        // Find anchor
        const anchor: RawData<any> = data.find((v: {description: string}) => (v.description.includes(this.config.anchor.identifier)))

        const anchorBL = anchor.boundingPoly.vertices[3]

        const firstCellTL = {x: anchorBL.x - this.config.anchor.offset.x, y: anchorBL.y + this.config.anchor.offset.y}

        let filledData: RawData<any> = {}
        let topBorder = firstCellTL.y

        for (let r = 0; r < this.config.canvas.getMaxRows(); r++) {
            let row: RawData<any> = {}

            const bottomBorder = topBorder + this.config.canvas.dataCell.secondary.height
            let leftBorder = firstCellTL.x
            let dataCellCount = 0

            for (let c = 0; c < this.config.canvas.getMaxColumns(); c++) {
                const rightBorder = leftBorder + (this.config.canvas.getCellSizeInLine(c)?.width || 0)

                // Find matching bits from data set
                const matches = data.filter((v: any) => {
                    const corners = new AlignedOrderedPairs(v.boundingPoly.vertices)
                    const [MT, MB, ML, MR] = corners.getMeanBorders()

                    // Retrieve error correction width
                    const error = this.config.canvas.error

                    if ((ML > (leftBorder - error)) && (MR < (rightBorder + error))){
                        if ((MT > (topBorder - error)) && (MB < (bottomBorder + error))) {
                            return true
                        }
                    }

                    return false
                })

                // Group raw data by line spacing
                const grouped = DataProcessor.groupByLineSpacing(matches, this.config.canvas.lineSpacing)

                // If data cell is presented
                if (this.config.canvas.getCellTypeInLine(c) === "DS") {
                    dataCellCount++
                    row[dataCellCount] = grouped
                }

                // Move left border 1 step to the right side
                leftBorder = rightBorder
            }
            filledData[r+1] = row
            topBorder = bottomBorder
        }

        return refine(filledData)

    }
}
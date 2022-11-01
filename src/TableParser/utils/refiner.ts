import {TableBody} from "../../interfaces/ParsedDataTypes";

export function refine(data: TableBody ) {
    Object.keys(data).forEach((k) => {
        Object.keys(data[k]).forEach((v) => {
            const val = data[k][v]

            // Dust removal
            if (val.includes("|")) {
                data[k][v] = []
            }
        })

        if (k === "5") {
            data[k] = {
                "1": data[k]["1"],
                "2": data[k]["2"],
                "3": data[k]["3"],
            }
        }
    })

    return data
}
import { writeFileSync } from "fs";
import { SrdFile } from "./SrdFile";

var srdFile = new SrdFile
srdFile.loadFromPath("C:\\Users\\evan6\\Downloads\\DRV3-Sharp_overhaul2_Release_2021-12-18 (1)\\model.srd", "", "")
var data = srdFile.writeBlocks("", "")
writeFileSync("model.srd", data.BaseBuffer)

/*
function unpackAllSpcs(dir: string[], currentPath: string) {
    for (var file of dir) {
        var filePath = currentPath + "\\" + file
        var stats = lstatSync(filePath)
        if (stats.isDirectory()) {
            unpackAllSpcs(readdirSync(filePath), filePath)
        } else if (file.endsWith(".SPC")) {
            console.log("extracting: ", file)
            exec(`"${spcToolPath}" "${filePath}" {extract} {*} {exit}`, ((err, stdout, stderr) => {
                console.log("done")
            }))
        }
    }
}
*/
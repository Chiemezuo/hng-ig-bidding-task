const fs = require('fs')
const sha256 = require('sha256')
const csv = require('csvtojson')
const { stringify } = require('csv-stringify')

// Take in the file name and set the eventual file output name
const fileInputName = process.argv[2]

// The string name without the extension
const splitArray = fileInputName.split(".")
const fileInputNameWithoutExt = splitArray[0]
const fileOutputName = `${fileInputNameWithoutExt}.output.csv`

//Convert the CSV to a JSON file and append the file format
const csvFilePath = `${__dirname}/${process.argv[2]}`
csv()
  .fromFile(csvFilePath)
  .then(json => {
    for (let i = 0; i < json.length; i++) {
      json[i].format = "CHIP-0007"
    }

    const hash = sha256(JSON.stringify(json))

    for (let i = 0; i < json.length; i++) {
      json[i].sha256 = hash
    }

    stringify(json, {
      columns: Object.keys(json[0]),
      header: true,
    }, (err, output) => {
      fs.writeFile(`${__dirname}/${fileOutputName}`, output, err => {
        if (err) {
          console.log("You didn't follow the instructions properly")
        }
      })
    })

  })

// let json = csvToJson.fieldDelimiter(',').getJsonFromCsv(fileInputName);
// for (let i = 0; i < json.length; i++) {
//   json[i].format = "CHIP-0007"
// }

// Stringify the JSON and encrypt to sha256
// const hash = sha256(JSON.stringify(json))

// for (let i = 0; i < json.length; i++) {
//   json[i].sha256 = hash
// }

// console.log(json)

//Stringify it to the csv format
// stringify(json, {
//   columns: Object.keys(json[0]),
//   header: true,
// }, (err, output) => {
//   fs.writeFile(`${__dirname}/${fileOutputName}`, output, err => {
//     if (err) {
//       console.log("You didn't follow the instructions properly")
//     }
//   })
// })


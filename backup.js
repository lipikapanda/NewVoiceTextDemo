"use strict"
const superagent = require('superagent');
var param = "AEs";
var speech;
var inDrugName = "GOLIMUMAB"
var inAction = "year"
var inDay = "-2"

superagent.get('http://103.224.243.38/3Analytics/WS_VoiceResult.asmx/GetDrugDetails')
    .query({ DrugName: inDrugName, szAction:inAction, szDay:inDay })
    .end((err, res) => {
        if (err) { return console.log(err); }
        var result = res.text;
        console.log(result);
        const arrList = result.replace("[{","}]").split("}]")[1].split(",")
        var strDrugName = arrList[0].split(":")[1];
        var strAE = arrList[1].split(":")[1];
        var strSerious = arrList[2].split(":")[1];
        var strDeath = arrList[3].split(":")[1];

        switch(param){
            case "death":
                speech = strDeath + " death cases have been reported for drug " + strDrugName + " in last 2 years";
                break;

            case "serious":
                speech = strSerious + " serious cases have been reported for drug " + strDrugName + " in last 2 years";
                break;

            case "AEs":
                speech = strAE + " AE's have been reported for drug " + strDrugName + " in last 2 years";
                break;
        }
        console.log(speech);
    });

"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const superagent = require('superagent');

global.speech1="";


const restService = express();

restService.use(
    bodyParser.urlencoded({
      extended: true
    })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {



  const promise1 = new Promise(function(resolve, reject) {
    resolve(msg);
  });

  promise1.then(function(value) {



  var speech =
      req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.echoText
          ? req.body.queryResult.parameters.echoText + value
          : "Seems like some problem. Speak again.";

  var speechResponse = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: speech
            }
          }
        ]
      }
    }
  };

  return res.json({
    payload: speechResponse,
    //data: speechResponse,
    fulfillmentText: speech,
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });

  });
});

async function msg(){

  var param = "AEs";
  var inDrugName = "humira"
  var inAction = "year"
  var inDay = "-2"

  superagent.get('http://103.224.243.38/3Analytics/WS_VoiceResult.asmx/GetDrugDetails')
      .query({ DrugName: inDrugName, szAction:inAction, szDay:inDay })
      .end((err, res) => {

        var result = res.text;

        const arrList = result.replace("[{","}]").split("}]")[1].split(",");
        var strDrugName = arrList[0].split(":")[1];
        var strAE = arrList[1].split(":")[1];
        var strSerious = arrList[2].split(":")[1];
        var strDeath = arrList[3].split(":")[1];

        switch(param){
          case "death":
            speech1 = strDeath + " death cases have been reported for drug " + strDrugName + " in last 5 years";
            break;

          case "serious":
            speech1 = strSerious + " serious cases have been reported for drug " + strDrugName + " in last 5 years";
            break;

          case "AEs":
            speech1 = strAE + " AE's have been reported for drug " + strDrugName + " in last 5 years";
            break;
        }

      });
  setTimeout(function afterTwoSeconds() {
    return speech1;
  }, 5000)

}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
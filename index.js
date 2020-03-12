"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const superagent = require('superagent');

global.speech1="b";
global.speech="a";


const restService = express();

restService.use(
    bodyParser.urlencoded({
      extended: true
    })
);

restService.use(bodyParser.json());



    (async () => {

        restService.post("/echo", function(req, res) {

            var param = req.body.queryResult.parameters.casetype;;
            var inDrugName = req.body.queryResult.parameters.drugname;
            var inAction = "year";
            var inDay = "-1";


        const responseBody = await getProjectParameterValue("myProjectId", "someParameter")
        console.log(responseBody);


        var result = responseBody;
        const arrList = result.replace("[{","}]").split("}]")[1].split(",")
        var strDrugName = arrList[0].split(":")[1];
        var strAE = arrList[1].split(":")[1];
        var strSerious = arrList[2].split(":")[1];
        var strDeath = arrList[3].split(":")[1];

        switch(param){
            case "death":
                speech1 = strDeath + " death cases have been reported for drug " + strDrugName + " in last 2 years";
                break;

            case "serious":
                speech1 = strSerious + " serious cases have been reported for drug " + strDrugName + " in last 2 years";
                break;

            case "AEs":
                speech1 = strAE + " AE's have been reported for drug " + strDrugName + " in last 2 years";
                break;
        }

        var speech = req.body.queryResult.parameters.drugname + " - " + speech1;


            return res.json({
                payload: {
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
                },
                //data: speechResponse,
                fulfillmentText: speech,
                speech: speech,
                displayText: speech,
                source: "webhook-echo-sample"
            });
        });
        
    })();



function getProjectParameterValue(projectId, parameter) {

    return new Promise(function(resolve, reject) {
        superagent.get('http://103.224.243.38/3Analytics/WS_VoiceResult.asmx/GetDrugDetails')
            .query({DrugName: inDrugName, szAction: inAction, szDay: inDay})
            .then(response => {
                return response.text
            })
            .then(result => {
                resolve(result)
            });
    });
}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
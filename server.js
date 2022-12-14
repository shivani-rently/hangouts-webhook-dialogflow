const express = require("express");
const axios = require("axios");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Is Working......");
});

app.post("/webhook", (req, res) => {
  let agent = new WebhookClient({ request: req, response: res });

  let intentMap = new Map();

  intentMap.set("weatherReport", weatherReportIntent);
  intentMap.set("checklist.info", checklistInfoIntent);

  agent.handleRequest(intentMap);
});

function weatherReportIntent(agent) {
  return axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?q=${agent.parameters.city}&APPID=91d37924fbd4af76aa1f805692e64fc6`
    )
    .then((res) => {
      console.log(res.data);
      agent.add(
        `Weather is ${res.data.weather[0].description} and feels like ${res.data.main.feels_like}`
      );
    })
    .catch((err) => {
      console.log(err);
      agent.add("Oops, couldn't get the details at the moment :(");
    });
}

function checklistInfoIntent(agent) {
  var techstack = agent.parameters.techstack;
  agent.add("Check the below link to get the checklist");
  if (techstack === "react") {
    agent.add("http://bit.ly/3uJRRV9");
  } else if (techstack === "ror") {
    agent.add("http://bit.ly/3URY24f");
  } else if (techstack === "node") {
    agent.add("http://bit.ly/3iZfDtO");
  } else if (techstack === "react-native") {
    agent.add("http://bit.ly/3W9a5v2");
  }
}

app.listen(8000, () => {
  console.log("Server is Running on port 8000");
});

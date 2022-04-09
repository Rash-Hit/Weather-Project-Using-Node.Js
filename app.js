const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

require('dotenv').config()


const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;


  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/w/" + icon + ".png";
      const w_description = weatherData.weather[0].description;

      res.write("<h1>The Temperature in " + query + " is " + temp + " Celcius</h1>");
      res.write("<p> The current weather Condition in " + query + " is " + w_description + ". </p>")
      res.write("<img src = " + imageURL + ">");
      res.send();

    });
  });
});


app.listen(port, function() {
  console.log("Server Started at Port 3000");
})

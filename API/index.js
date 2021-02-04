const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();
let port = 4444;
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/receivelogs',  (req, res) => {
  console.log("receiving logs...")
  data = JSON.parse(req.body.data)
  // url, hashTime, labellingTime, featureExtractionTime, scriptSize (Bytes)
  fs.appendFileSync('logs.txt', `${data.url},${data.hashTime},${data.labellingTime},${data.featureExtractionTime},${data.scriptSize}\n`);
});


app.get("/test", (req,res)=>{
    res.send("route hit")
})

app.listen(port, () => {
  console.log(`The plugin server running at: ${port}`);
});
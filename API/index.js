const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();
let port = 4444;
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/receivelogs',  (req, res) => {
  console.log("receiving logs...")
  data = JSON.parse(req.body.data) 
  console.log(data) 
  // hashTime, labellingTime, featureExtractionTime, scriptSize (Bytes)
  // fs.appendFileSync('logs.txt', `${data.hashTime},${data.labellingTime},${data.featureExtractionTime},${data.scriptSize},${data.url}\n`);

});


app.get("/test", (req,res)=>{
    console.log("test route hit")
    res.send("route hit")
})

app.listen(port, () => {
  console.log(`The plugin server running at: ${port}`);
});
const express = require('express');
const fs = require('fs');
let app = express();
let port = 4444;


app.use(express.urlencoded({extended: true}));
app.use(express.json()) 


app.post('/receivelogs',  (req, res) => {
  console.log("receiving logs...")
  data = JSON.parse(req.body.data) 
  console.log(data) 
  // hashTime, labellingTime, featureExtractionTime, scriptSize (Bytes)
  // fs.appendFileSync('logs.txt', `${data.hashTime},${data.labellingTime},${data.featureExtractionTime},${data.scriptSize},${data.url}\n`);

});

// Accepting Requests for a Broken Page
app.post("/report_broken_page",(req, res)=>{
  const userId = req.body.user;
  const brokenPage = req.body.data;
  const timeStamp = Date.now();

  console.log("reporting...")
})

app.post("/send_data_report",(req, res)=>{
  const userId = req.body.user;
  const database = req.body.database;
  const visitInstances = req.body.visitInstances;

  console.log(visitInstances)
})

app.get("/test", (req,res)=>{
    console.log("test route hit")
    res.send("route hit")
})

app.listen(port, () => {
  console.log(`The plugin server running at: ${port}`);
});
// import tf from './tf.js'; 

browser = (function () {
    return window.browser || window.chrome;
})();

var db;
var featuresList =[]
var testSet = [];
var trainingSet = [];

const setupDB = () =>{
        //check for support
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
        }

        else{
            console.log("Index DB supported")

            const request = window.indexedDB.open('tedb',2);

            request.onerror = (event) =>{
                console.log("error opening db...")
            }

            request.onupgradeneeded = (event) =>{
                db = event.target.result;
                
                let objectStore = db.createObjectStore('tests',{autoIncrement:true});
                
                objectStore.transaction.oncomplete = () =>{
                    console.log("store created")
                }
            }

            request.onsuccess = (event) =>{
                db = event.target.result;

                if (!db.objectStoreNames.contains('tests')){
                    console.log("store does not exist");
                }
                else{
                    console.log("store exists")

                    var tx = db.transaction('tests', 'readwrite');
                    var store = tx.objectStore('tests')

                    // Go through line by line and store in db
                    
                    // var request = store.add("okay this is my input");

                    // request.onerror = function(e) {
                    //     console.log('Error', e.target.error.name);
                    // };

                    // request.onsuccess = function(e) {
                    // console.log('Woot! Did it');
                    // };

                    var getall = store.getAll();

                    getall.onsuccess = (event) =>{
                        console.log(event.target.result);
                    }
                }
            }
 
        }
}

let getFeatures = (_path) => {
    return new Promise((resolve, reject) => {
        fetch(_path, {mode:'same-origin'})
            .then(function(_res) {
                return _res.blob();
            })
            .then(function(_blob) {
                var reader = new FileReader();

                reader.addEventListener("loadend", function() {
                    resolve(this.result);
                });

                reader.readAsText(_blob);
            })
            .catch(error => {
                reject(error);
            });
    });
};

getFeatures('selectedFeatures.txt').then(_res => {

        lines = _res.split('\n');

        lines.forEach(line=>{
            featuresList.push(line)
        })

        // console.log(featuresList)
        // setupDB();
    })
    .catch(_error => {
        console.log(_error );
});



classes = ["ads+marketing", "tag-manager+content", "hosting+cdn", "video", "utility", "analytics", "social", "customer-success"]

tf.loadLayersModel(browser.extension.getURL("model/model.json")).then( model=> {

    getFeatures("feature_index_mapping.json").then(async res=>{

        let featureIndexMapping = JSON.parse(res);

        browser.webRequest.onBeforeSendHeaders.addListener(
            async (details) => {
                if (details.type == "script"){  

                    await fetch(details.url).then(r => r.text()).then(async result => {

                        let featuresCount = {}

                        // Replace all multiple consecutive white spaces with one white space
                        //result = result.replace(/\s+/g, ' ')

                        featuresList.forEach(feature =>{

                            if (!feature.includes("__")){
                                let searchTerm = "."+feature+"\\("
                                let searchTerm2 = "."+feature+" \\("
                                let count = result.search(searchTerm);
                                let count2 =  result.search(searchTerm2) 
                                count == -1 ? featuresCount[feature] = 0 : featuresCount[feature] = count
                                count2 == -1 ? "" : featuresCount[feature] += count2
                            }

                            else{
                                let feats = feature.split('__')
                                let res = 1

                                feats.forEach(feat=>{
                                    let searchTerm = "."+feat+"\\("
                                    let searchTerm2 = "."+feature+" \\("
                                    let count = result.search(searchTerm)
                                    let count2 =  result.search(searchTerm2)

                                    if (count == -1 || count2 == -1)
                                        res = 0

                                })

                                featuresCount[feature] = res
                            }

                        })

                        let scriptArrayData = [[]];
                        for (let i=0; i<508; ++i) scriptArrayData[0][i] = 0;

                        // Filling the scriptArrayData with feature occurences
                        await featuresList.forEach(async feature =>{
                            if (featuresCount[feature] !=0){
                                //get features's index on the list
                                featureIndex = featureIndexMapping[feature]
                                scriptArrayData[0][featureIndex] = featuresCount[feature];
                            }
                        })

                        let newDataTensor = tf.tensor2d(
                            scriptArrayData,
                            [1, 508]
                        );                

                        predictions = model.predict(newDataTensor)  

                        let maxProbability = Math.max(...predictions.dataSync());
                        let predictionIndex = predictions.dataSync().indexOf(maxProbability);
                    
                        console.log("                               ")
                        console.log("******************************")
                        console.log(details.url)
                        console.log("predicted class -- "+ classes[predictionIndex])
                        console.log("******************************")
                        console.log("                               ")

                    })

                }
            },
        {urls: ["<all_urls>"]},
        ["blocking"]);

        
    })


} );
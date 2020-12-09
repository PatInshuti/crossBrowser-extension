// import tf from './tf.js'; 

browser = (function () {
    return window.browser || window.chrome;
})();

var db;
let db_name = "db38"
let featureStore = "featureStore"
var featuresList =[]
var testSet = [];
var trainingSet = [];

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


const setupDB = async (data) =>{

        //check for support
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
        }

        else{

                // Fetch Features Locally
                await getFeatures('selectedFeatures.txt').then(_res => {

                    lines = _res.split('\n');
                    
                    lines.forEach(async line=>{
                        await featuresList.push(line)
                    })
                })
            
                //open the db 
                const request = window.indexedDB.open(db_name,2);

                request.onerror = (event) =>{
                    console.log("error opening db...")
                }
                
                // Runs only one time
                request.onupgradeneeded = async (event) =>{

                    db = event.target.result;
                    
                    let objectStore = db.createObjectStore(featureStore,{autoIncrement:true});

                    objectStore.transaction.oncomplete = () =>{
                        console.log("store created")
                    }

                    await featuresList.forEach(async feature=>{
                        await objectStore.add(feature)
                    })

                }
                
                // // Runs 
                // request.onsuccess = (event) =>{
                //     db = event.target.result;
    
                //     if (!db.objectStoreNames.contains(featureStore)){
                //         console.log("store does not exist");
                //     }
                //     else{
                //         console.log("store exists")
    
                //         var tx = db.transaction(featureStore, 'readwrite');
                //         var store = tx.objectStore(featureStore)
    
                //         // Go through line by line and store in db
                        
                //         // var request = store.add("okay this is my input");
    
                //         // request.onerror = function(e) {
                //         //     console.log('Error', e.target.error.name);
                //         // };
    
                //         // request.onsuccess = function(e) {
                //         // console.log('Woot! Did it');
                //         // };
    
                //         var getall = store.getAll();
    
                //         getall.onsuccess = (event) =>{
                //             console.log(event.target.result);
                //         }
                //     }
    
                //     // db.deleteObjectStore("tests");
                // }
 
        }
}

setupDB(); 
// getFeatures('selectedFeatures.txt').then(_res => {

//         lines = _res.split('\n');

//         lines.forEach(line=>{
//             featuresList.push(line)
//         })

//         // console.log(featuresList)
//         var data = "saveFeatures"
//         // setupDB(data);
//     })
//     .catch(_error => {
//         console.log(_error );
// });

classes = ["ads+marketing", "tag-manager+content", "hosting+cdn", "video", "utility", "analytics", "social", "customer-success"]

tf.loadLayersModel(browser.extension.getURL("model/model.json")).then( model=> {

    getFeatures("feature_index_mapping.json").then(async res=>{

        let featureIndexMapping = JSON.parse(res);

        //open the db 
        const request = window.indexedDB.open(db_name,2);

        request.onerror = (event) =>{
            console.log("error opening db...")
        }

        // Run
        request.onsuccess = (event) =>{
            db = event.target.result;

            if (!db.objectStoreNames.contains(featureStore)){
                console.log("store does not exist");
            }
            else{
                console.log("store exists")

                var tx = db.transaction(featureStore, 'readwrite');
                var featureDBStore = tx.objectStore(featureStore);
                var getall = featureDBStore.getAll();

                getall.onsuccess = (event) =>{
                    featuresList = event.target.result;
                    browser.webRequest.onBeforeSendHeaders.addListener( async (details) => {
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

                }
            }
        }

    })

} );
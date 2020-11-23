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

// getFeatures('FinalFeatures.txt').then(_res => {

//         lines = _res.split('\n');
//         lines.forEach(line=>{
//             line = line.split('|')[0]
//             featuresList.push(line)
//         })

//         // console.log(featuresList)
//         // setupDB();
//     })
//     .catch(_error => {
//         console.log(_error );
// });



browser.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.type == "script"){  

            console.log("-------------"+details.url+"-------------")
            fetch(details.url).then(r => r.text()).then(result => {

                let featuresCount = {}

                featuresList.forEach(feature =>{
                    let searchTerm = "."+feature+"\\("
                    let count = result.search(searchTerm);
                    count == -1 ? featuresCount[feature] = 0 : featuresCount[feature] = count
                })

                console.log(featuresCount)
            })
        }
    },
{urls: ["<all_urls>"]},
["blocking"]);



classes = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"]

let test_data2 = [5.9,3.0,5.1,1.8]

tf.loadLayersModel(browser.extension.getURL("model/model.json")).then( model=> {

    let newDataTensor = tf.tensor2d(
        test_data2,
        [1, 4]
      );
      
    predictions = model.predict(newDataTensor)  

    let maxProbability = Math.max(...predictions.dataSync());
    let predictionIndex = predictions.dataSync().indexOf(maxProbability);

    console.log("===== " +classes[predictionIndex] +" =====")

} );
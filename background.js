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
            line = line.split('|')[0]
            featuresList.push(line)
        })

        // console.log(featuresList)
        // setupDB();
    })
    .catch(_error => {
        console.log(_error );
});





classes = ["ads+marketing", "tag-manager+content", "hosting+cdn", "video", "utility", "analytics", "social", "customer-success"]

test_data = [[ 0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  1.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0., 16.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    1.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  1.,  0.,  1.,
    0.,  1.,  0.,  0.,  0.,  0.,  0.,  6.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  4.,  0.,  0.,  1.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  4.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  1.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  1.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  6.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0., 19.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  1.,  4.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  1.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  2.,
    0.,  0.,  0.,  0.,  3.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  1.,
    7.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,  0.,
    0.]]

tf.loadLayersModel(browser.extension.getURL("model/model.json")).then( model=> {

    let newDataTensor = tf.tensor2d(
        test_data,
        [1, 508]
    );



    browser.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (details.type == "script"){  

                console.log("-------------"+details.url+"-------------")
                fetch(details.url).then(r => r.text()).then(result => {

                    let featuresCount = {}

                    featuresList.forEach(feature =>{

                        if (!feature.includes("__")){
                            let searchTerm = "."+feature+"\\("
                            let count = result.search(searchTerm);
                            count == -1 ? featuresCount[feature] = 0 : featuresCount[feature] = count
                        }

                        else{
                            let feats = feature.split('__')
                            let res = 1

                            feats.forEach(feat=>{
                                let searchTerm = "."+feat+"\\("
                                let count = result.search(searchTerm)

                                if (count == -1)
                                    res = 0

                                featuresCount[feature] = res
                            })
                        }

                    })

                    console.log(featuresCount)
                    let array_data = new Array(508); for (let i=0; i<508; ++i) array_data[i] = 0;

                    getFeatures("feature_index_mapping.json").then(res=>{

                        featureIndexMapping = JSON.parse(res);
                        
                        featuresCount.forEach(feature =>{
                            if (featuresCount[feature] !=0){
                                //get features's index on the list
                                featureIndex = featureIndexMapping[feature]
                                array_data[featureIndex] = featuresCount[feature];
                            }
                        })

                        
                    })


                })



            }
        },
    {urls: ["<all_urls>"]},
    ["blocking"]);

      
    predictions = model.predict(newDataTensor)  

    let maxProbability = Math.max(...predictions.dataSync());
    let predictionIndex = predictions.dataSync().indexOf(maxProbability);

    console.log("predicted class --> "+ classes[predictionIndex])

} );
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

// let model = tf.sequential();

// model.add(tf.layers.dense(
//     {
//         inputShape: 4,
//         activation: 'sigmoid',
//         units: 10
//     }
// ));

// model.add(tf.layers.dense(
//     {
//         inputShape: 10,
//         units: 3,
//         activation: 'softmax'
//     }
// ));

// model.compile({
//     loss: "categoricalCrossentropy",
//     optimizer: tf.train.adam()
// });

const start_model = async() =>{

    await getFeatures('testing.json').then(_res => {
        jsonres = (JSON.parse(_res))
    
        jsonres.map(res =>{
            testSet.push(res)
        })
    })
    .catch(_error => {
        console.log(_error );
    });

    await getFeatures('training.json').then(_res => {
        jsonres = (JSON.parse(_res))
    
        jsonres.map(res =>{
            trainingSet.push(res)
        })
    })
    .catch(_error => {
        console.log(_error );
    });

    // console.log(testSet)
    // console.log(trainingSet)


    let trainingData = tf.tensor2d(
        trainingSet.map(item => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width
        ]),
        [trainingSet.length, 4]
    );
      
    let testData = tf.tensor2d(
        testSet.map(item => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width
        ]),
        [14, 4]
    );


    let outputData = tf.tensor2d(trainingSet.map(item => [
        item.species === 'setosa' ? 1 : 0,
        item.species === 'virginica' ? 1 : 0,
        item.species === 'versicolor' ? 1 : 0
    
    ]), [trainingSet.length,3])


    let model = tf.sequential();

    model.add(tf.layers.dense(
        {
            inputShape: 4,
            activation: 'sigmoid',
            units: 10
        }
    ));

    model.add(tf.layers.dense(
        {
            inputShape: 10,
            units: 3,
            activation: 'softmax'
        }
    ));

    model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam()
    });

        model.fit(trainingData, outputData,{epochs: 40});


    let test = [{"petal_length": 1, "petal_width": 0.7, "sepal_length": 1.5, "sepal_width": 0.4},{"petal_length": 1, "petal_width": 0.7, "sepal_length": 1.5, "sepal_width": 0.4}]
    
    let newDataTensor = tf.tensor2d(
        test.map((item) => [
          item.sepal_length,
          item.sepal_width,
          item.petal_length,
          item.petal_width
        ]),
        [test.length, 4]
    );

    console.log("**************PREDICTION*****************")

    model.predict(newDataTensor).print();


}

start_model()



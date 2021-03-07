// import tf from './tf.js'; 
browser = (function () {
    return window.browser || window.chrome;
})();

var isFirefox = typeof InstallTrigger !== 'undefined';

var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

const Http = new XMLHttpRequest();
serverDomain = "10.225.86.123"
port = "4444"
const apiUrl=`http://${serverDomain}:${port}/receivelogs`;

var db;
let db_name = "db42"
let featureStore = "featureStore"
let hashCodeToScriptStore = "hashCodeToScriptStore"
var featuresList =[]
var testSet = [];
var trainingSet = [];
var hashScriptMapping = {}
let scriptCategory = [];
let timeComplexity = [];
// let timeComplexity = [{
//     url:"",
//     scriptSize:"",
//     complexities:[{hashTime:"",labellingTime:"",featureExtractionTime:""}]
// }]

// Get the website from url
const domain_from_url = (url) => {
    let result;
    let match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
} 


const retrieve_SendBlockingInformation = () =>{

    let retrievedObject = localStorage.getItem('blockSettings');
    retrievedObject = JSON.parse(retrievedObject);

    browser.runtime.sendMessage({ from:"backgroundScript",message:retrievedObject });

}

async function hashString(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const getByteSize = str => new Blob([str]).size;


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
                
                let featureObjectStore = db.createObjectStore(featureStore,{autoIncrement:true});
                featureObjectStore.transaction.oncomplete = () =>{
                    console.log("feature store created")
                }

                let hashCodeToScriptObjectStore = db.createObjectStore(hashCodeToScriptStore, {keyPath: 'id'});
                hashCodeToScriptObjectStore.transaction.oncomplete = () =>{
                    console.log("hashcode_to_script store created")
                }

                await featuresList.forEach(async feature=>{
                    await featureObjectStore.add(feature)
                })

            }
        }
}



const runScriptLabelling = (featureIndexMapping, model) =>{

    browser.webRequest.onBeforeSendHeaders.addListener( (details) => {

        return new Promise(async (resolve, reject) => {

            let categoriesToBlock = [];

            // retrieve block settings per website
            browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var currTab = tabs[0];
                if (currTab) { // Sanity check
                    website = domain_from_url(currTab.url);

                    let retrievedSettings = localStorage.getItem('blockSettingsPerWebsite');
                    retrievedSettings = JSON.parse(retrievedSettings);

                    if (retrievedSettings !== null){
                        if (retrievedSettings[website] !== undefined && retrievedSettings[website] == false){
                            categoriesToBlock = [] //do not block any
                        }

                        // change this to true later
                        else{
                            categoriesToBlock = ["ads+marketing","social","analytics"]
                        }
                    }

                    else{
                        categoriesToBlock = ["ads+marketing","social","analytics"]
                    }
                }
        
            });
    
    
            if (details.type == "script"){
    
                fetch(details.url).then(r => r.text()).then(async result => {
    
                    // Get the hash string
                    let startHashTime = Date.now();
                    let hashValue = await hashString(result);
                    let stopHashTime = Date.now();
    
                    let hashTime = stopHashTime - startHashTime; //*** hashtime */
    
                    var tx2 = db.transaction(hashCodeToScriptStore, 'readwrite');
                    var hashCodeToScriptDBStore = tx2.objectStore(hashCodeToScriptStore);
                    // Look up the hashcode in the DB Store
                    var getAllhashCodeToScript = hashCodeToScriptDBStore.get(hashValue);
    
                    getAllhashCodeToScript.onsuccess = async (event) =>{
                        // Start intercepting requests
                        theMapping = event.target.result;
    
                        // First check if script hashcode exists in the objectStore
                        if (theMapping == undefined){
    
                            let startExtractionTime = Date.now();
    
                            let featuresCount = {}
    
                            // Replace all multiple consecutive white spaces with one white space
                            result = result.replace(/\s+/g, ' ')
    
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
    
                            let stopExtractionTime = Date.now();
                            let featureExtractionTime = stopExtractionTime - startExtractionTime; //*** featureExtraction */
    
                            let startLabellingTime = Date.now();
    
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
    
                            let stopLabellingTime = Date.now();
    
                            let labellingTime = stopLabellingTime - startLabellingTime; // *** labelling time
    
                            // console.log("hashTime "+ hashTime + " milliseconds") /* =============== */
                            // console.log("featureExtractionTime: "+ featureExtractionTime);
                            // console.log("labelling Time: "+ labellingTime);
                            let scriptSize = getByteSize(result);
                            timeComplexity.push({
                                "url":details.url,
                                "scriptSize":scriptSize,
                                "complexities":[{hashTime:hashTime,labellingTime:labellingTime,"featureExtractionTime":featureExtractionTime}]
                            })
    
    
                            // Initialize db
                            var tx2 = db.transaction(hashCodeToScriptStore, 'readwrite');
                            var hashCodeToScriptDBStore = tx2.objectStore(hashCodeToScriptStore);
                            
                            let hashScriptMapping = {}
                            let finalLabel = ""

                            if (maxProbability < 0.8){
                                hashScriptMapping["id"] = hashValue;
                                hashScriptMapping["label"] = "unknown";
                                finalLabel = "unknown"
                            }

                            else{
                                hashScriptMapping["id"] = hashValue;
                                hashScriptMapping["label"] = classes[predictionIndex]
                                finalLabel = classes[predictionIndex]
                            }
    
    
                            var request = hashCodeToScriptDBStore.add(hashScriptMapping);
    
                            request.onerror = function(e) {
                                console.log('Error', "Script hash code already exists");
                            };
    
                            request.onsuccess = function(e) {
                            console.log('Added a new hascode script');
                            };
    
                            // send data to API
                            Http.open("POST", apiUrl);
                            console.log(apiUrl)
                            Http.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
                            Http.send(
                            `data=${
                                JSON.stringify(
                                    {"phoneType":"",
                                    "hashTime":hashTime,"labellingTime":labellingTime,"featureExtractionTime":featureExtractionTime,"scriptSize":scriptSize})
                                }`
                            );
                            
                        
                            // console.log("******************************")
                            // console.log("                               ")
    
                            // console.log(hashValue)
                            // console.log(details.url)
                            console.log("predicted class -- "+ finalLabel)
                            // // scriptCategory.unshift(classes[predictionIndex])
                            // console.log("******************************")
                            // console.log("                               ")

                            resolve({cancel: categoriesToBlock.includes(finalLabel) ? true:false  })

                        }
    
                        else{
                            let scriptSize = getByteSize(result);
                            timeComplexity.push({
                                "url":details.url,
                                "scriptSize":scriptSize,
                                "complexities":[{hashTime:hashTime,labellingTime:null,featureExtractionTime:null}]
                            })
    
                            // Send data to API
                            Http.open("POST", apiUrl);
                            console.log(apiUrl)
                            Http.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
                            Http.send(
                            `data=${
                                JSON.stringify(
                                    {"phoneType":"",
                                    "hashTime":hashTime,"labellingTime":null,"featureExtractionTime":null,"scriptSize":scriptSize})
                                }`
                            );
    
    
                            // console.log("******************************")
                            // console.log("                               ")
    
                            // console.log("script hashcode to label mapping already exists -- retrieving label")
                            // console.log(details.url)
                            // console.log(theMapping)
                            // scriptCategory.unshift(theMapping.label);
                            // console.log("******************************")
                            // console.log("                               ")

                            resolve({cancel: categoriesToBlock.includes(theMapping.label) ? true:false  })

    
                        }
                    }

    
                })
            
            }

            else{
                resolve()
            }



        })


    },
    {urls: ["<all_urls>"]},
    ["blocking"]);

}

setupDB();


// consider them as ** content ** --->> tag-manager+content * hosting+cdn * utility * customer-success
classes = ["ads+marketing", "tag-manager+content", "hosting+cdn", "video", "utility", "analytics", "social", "customer-success"]

tf.loadLayersModel(browser.extension.getURL("model/model.json")).then( model => {

    getFeatures("feature_index_mapping.json").then(async res=>{

        let featureIndexMapping = JSON.parse(res);

        //open the db 
        const request = window.indexedDB.open(db_name,2);

        request.onerror = (event) => {
            console.log("error opening db...")
        }

        // Run
        request.onsuccess = (event) => {
            db = event.target.result;

            if (!db.objectStoreNames.contains(featureStore) || !db.objectStoreNames.contains(hashCodeToScriptStore)){
                console.log("One of the store does not exist");
            }
            else{
                console.log("All DB Stores exist")

                var tx = db.transaction(featureStore, 'readwrite');
                var featureDBStore = tx.objectStore(featureStore);
                var getallFeatures = featureDBStore.getAll();

                getallFeatures.onsuccess = (event) => {
                    // Start intercepting requests
                    featuresList = event.target.result;
                    runScriptLabelling(featureIndexMapping,model);
                }
            }
        }

    })

} );

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.from == "popupScript") {
        let settings = message.message;

        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            if (currTab) { // Sanity check
                website = domain_from_url(currTab.url);

                let data = {}
                data[website] = settings.appleSwitchButton

                // save the data on localstorage
                localStorage.setItem('blockSettingsPerWebsite', JSON.stringify(data));
            }

        });

        // Retrieve all information in localstorage and send it back to popupScript
        retrieve_SendBlockingInformation();
    }
});
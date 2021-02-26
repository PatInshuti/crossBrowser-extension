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
let db_name = "db41"
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

    if (isFirefox){
        forFirefox();
    }
    
    else if (isChrome){
        forChrome();
    }


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

        // Put the object into storage
        localStorage.setItem('blockSettings', JSON.stringify(settings));

        // Retrieve the object from storage
        var retrievedObject = localStorage.getItem('blockSettings');
    }
});
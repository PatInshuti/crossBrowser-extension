if( 'function' === typeof importScripts) {
    importScripts('tf.js');
    
    addEventListener('message', onMessage);
 
    function onMessage(e) { 
        let featuresList = e.data.featuresList;
        let url = e.data.url;
        let hashValue = e.data.url;
        let featureIndexMapping = e.data.featureIndexMapping;
        let hashCodeToScriptStore = e.data.hashCodeToScriptStore;
        let db_name = e.data.db_name;
        let db_version = e.data.db_version;
        classes = ["ads+marketing", "tag-manager+content", "hosting+cdn", "video", "utility", "analytics", "social", "customer-success"]


        tf.loadLayersModel("model/model.json").then( model => {
    
            fetch(url).then(r => r.text()).then(async result => {
                            
                let featuresCount = {}
        
                result = result.replace(/\s+/g, ' ')
                featuresList.forEach(feature => {
        
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
                
                
                // Initialize db

                var req = indexedDB.open(db_name, db_version);
                req.onupgradeneeded = function (e) {
                    self.postMessage('successfully upgraded db');              
                };
                req.onsuccess = async function (e) {

                    db = e.target.result;

                    var tx2 = db.transaction(hashCodeToScriptStore, 'readwrite');
                    
                    var hashCodeToScriptDBStore = tx2.objectStore(hashCodeToScriptStore);
            
                    var request = await hashCodeToScriptDBStore.add(hashScriptMapping);
            
                    request.onerror = function(e) {
                        console.log('Error', "Script hash code already exists");
                    };
            
                    request.onsuccess = function(e) {
                        postMessage(hashScriptMapping);
                    };
                };
                req.onerror = function(e) {
                    self.postMessage('error');    
                }
                        
            })

        })


    }    
}
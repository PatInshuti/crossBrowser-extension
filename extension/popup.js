
let db_name = "capstone_plugin_v24"
let db_version = 1
let hashCodeToScriptStore = "hashCodeToScriptStore"
let instanceStore = "instanceStore"
let serverDomain = "10.225.86.123"
let port = "4444"
let apiUrl=`http://${serverDomain}`;
let testUrl = `http://10.225.86.123.:4444`

browser = (function () {
    return window.browser || window.chrome;
})();

document.addEventListener('DOMContentLoaded', function(){
    

    let uniqueUserIdentification = localStorage.getItem("uniqueUserIdentificationPlugin");
    
    let report_broken_pageButton =  document.getElementById("report_broken_page");
    let send_dataButton = document.getElementById("send_data")

    report_broken_pageButton.addEventListener("click",()=>{

        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];

            if (currTab) { 

                data = {
                    "data":currTab.url,
                    "user":uniqueUserIdentification
                }

                fetch(testUrl+"/report_broken_page", {
                    method: 'POST', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
            
                    body: JSON.stringify(data)
                });
            }

        })

    })


    send_dataButton.addEventListener("click",()=>{

        const request = window.indexedDB.open(db_name,db_version);

        request.onerror = (event) => {
            console.log("error opening db...")
        }
    
        request.onsuccess = (event) => {
            db = event.target.result;

            var tx2 = db.transaction(hashCodeToScriptStore, 'readwrite');
            var hashCodeToScriptDBStore = tx2.objectStore(hashCodeToScriptStore);
            var getAllhashCodeToScript = hashCodeToScriptDBStore.getAll();
            
            getAllhashCodeToScript.onsuccess = async (event) =>{
                // Start intercepting requests
                let theMapping = event.target.result;

                data = {
                    "database":theMapping,
                    "user":uniqueUserIdentification
                }

                var tx3 = db.transaction(instanceStore, 'readwrite');
                var instanceDBStore = tx3.objectStore(instanceStore);
                var visitInstanceDBStore = instanceDBStore.getAll();
                
                visitInstanceDBStore.onsuccess = async (event) =>{
                    let visitInstances = event.target.result;
                    data["visitInstances"] = visitInstances;

                    fetch(testUrl+"/send_data_report", {
                        method: 'POST', 
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                
                        body: JSON.stringify(data)
                    });

                }
            }
        }

    })


})
browser = (function () {
    return window.browser || window.chrome;
})();

document.addEventListener('DOMContentLoaded', function(){

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


    // let button = document.getElementById("submit-button");
    let appleSwitchButton =  document.getElementById("apple-switch")


    // Just Setting the frontend
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) { // Sanity check

            website = domain_from_url(currTab.url);

            // check if website has blocking settings in localstorage
            let retrievedSettings = localStorage.getItem('blockSettingsPerWebsite');
            retrievedSettings = JSON.parse(retrievedSettings);

            if (retrievedSettings !== null){

                if (retrievedSettings[website] !== undefined){
                    appleSwitchButton.checked = retrievedSettings[website];
                }

                // change this to true later
                else{
                    appleSwitchButton.checked = true;
                }

            }

            else{
                appleSwitchButton.checked = true;
            }
        }

    });

    // Load the local storage
    // let retrievedSettings = localStorage.getItem('blockSettings');
    // retrievedSettings = JSON.parse(retrievedSettings);

    // check if retrievedSettings is not null
    // if (retrievedSettings !== null){
    //     // Set checkboxes through local storage
    //     document.getElementById("content").checked = retrievedSettings.content;
    //     document.getElementById("ads+marketing").checked = retrievedSettings.ads_marketing;
    //     document.getElementById("video").checked = retrievedSettings.video;
    //     document.getElementById("analytics").checked = retrievedSettings.analytics;
    //     document.getElementById("social").checked = retrievedSettings.social;
    //     document.getElementById("apple-switch").checked = retrievedSettings.apple_switch
    // }

    


    


    appleSwitchButton.addEventListener("click", (event)=> {

        if (appleSwitchButton.checked === true){
            appleSwitchButton.checked = true;
        }

        else{
            appleSwitchButton.checked = false;
        }

        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            if (currTab) { // Sanity check

                console.log(currTab)
                website = domain_from_url(currTab.url);
    
                let data = {}
                data[website] = appleSwitchButton.checked
    
                // save the data on localstorage
                localStorage.setItem('blockSettingsPerWebsite', JSON.stringify(data));
            }
    
        });


        // let data = {"appleSwitchButton":appleSwitchButton.checked};
        // browser.runtime.sendMessage({ from:"popupScript",message:data });

    });


    // browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    //     if (message.from == "backgroundScript") {
    //         let settings = message.message;

    //     }
    // });



    
    // button.addEventListener("click",(event) => {
        
    //     event.preventDefault();

    //     let content = false;
    //     let video = false
    //     let content = document.getElementById("content").checked;
    //     let ads_marketing = document.getElementById("ads+marketing").checked;
    //     let video = document.getElementById("video").checked;
    //     let analytics = document.getElementById("analytics").checked;
    //     let social = document.getElementById("social").checked;

    //     let data = {
    //         content,
    //         ads_marketing,
    //         video,
    //         analytics,
    //         social
    //     }
        
    //     browser.runtime.sendMessage({ from:"popupScript",message:data });

    // });

})
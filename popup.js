browser = (function () {
    return window.browser || window.chrome;
})();

document.addEventListener('DOMContentLoaded', function(){

    let button = document.getElementById("submit-button");


    // Load the local storage
    let retrievedSettings = localStorage.getItem('blockSettings');
    retrievedSettings = JSON.parse(retrievedSettings);

    // check if retrievedSettings is not null
    if (retrievedSettings !== null){
        // Set checkboxes through local storage
        // document.getElementById("content").checked = retrievedSettings.content;
        document.getElementById("ads+marketing").checked = retrievedSettings.ads_marketing;
        // document.getElementById("video").checked = retrievedSettings.video;
        document.getElementById("analytics").checked = retrievedSettings.analytics;
        document.getElementById("social").checked = retrievedSettings.social;
    }

    
    button.addEventListener("click",(event) => {
        
        event.preventDefault();

        let content = false;
        let video = false
        // let content = document.getElementById("content").checked;
        let ads_marketing = document.getElementById("ads+marketing").checked;
        // let video = document.getElementById("video").checked;
        let analytics = document.getElementById("analytics").checked;
        let social = document.getElementById("social").checked;

        let data = {
            content,
            ads_marketing,
            video,
            analytics,
            social
        }
        
        browser.runtime.sendMessage({ from:"popupScript",message:data });

    });

})
document.addEventListener('DOMContentLoaded', function(){

    let button = document.getElementById("submit-button");
    
    button.addEventListener("click",(event) => {
        
        event.preventDefault();

        let content = document.getElementById("content").checked;
        let ads_marketing = document.getElementById("ads+marketing").checked;
        let video = document.getElementById("video").checked;
        let analytics = document.getElementById("analytics").checked;
        let social = document.getElementById("social").checked;

        let data = {
            content,
            ads_marketing,
            video,
            analytics,
            social
        }

        chrome.runtime.sendMessage({ from:"popupScript",message:data });

    });

})
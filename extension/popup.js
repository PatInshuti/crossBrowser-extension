browser = (function () {
    return window.browser || window.chrome;
})();

document.addEventListener('DOMContentLoaded', function(){
    // let button = document.getElementById("submit-button");
    let appleSwitchButton =  document.getElementById("apple-switch")


    // Just Setting the frontend

    // check if website has blocking settings in localstorage
    let retrievedSettings = localStorage.getItem('scriptBlockSettings');
    retrievedSettings = JSON.parse(retrievedSettings);

    if (retrievedSettings !== null){

        if (retrievedSettings !== undefined){
            appleSwitchButton.checked = retrievedSettings;
        }

        // change this to true later
        else{
            appleSwitchButton.checked = true;
        }

    }

    else{
        appleSwitchButton.checked = true;
    }


    appleSwitchButton.addEventListener("click", (event)=> {

        if (appleSwitchButton.checked === true){
            appleSwitchButton.checked = true;
        }

        else{
            appleSwitchButton.checked = false;
        }

        // save the data on localstorage
        localStorage.setItem('scriptBlockSettings', JSON.stringify(appleSwitchButton.checked));

    });

})
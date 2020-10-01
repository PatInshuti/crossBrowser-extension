// Load the javascript file of features

chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile("FinalFeatures.txt", {}, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
            lines = reader.result.split('\n');
            lines.forEach(line=>{
                console.log(line)
            })
        };
        reader.readAsText(file);
      });
    });
});


chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.type == "script"){

            fetch(details.url).then(r => r.text()).then(result => {
                // Result now contains the response text, do what you want...
                console.log(result)
            })

            // console.log(details)

            // var oReq = new XMLHttpRequest();


            // var res = oReq.open("GET",details.url);

            // console.log(res)
            
            // oReq.send();

        }
    },
{urls: ["<all_urls>"]},
["blocking"]);
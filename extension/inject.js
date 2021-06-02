const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
const renderTime = perfData.domComplete - perfData.domLoading;

console.log("Page Load Time: "+pageLoadTime)
console.log("Page Render Time: "+renderTime)

let resources = window.performance.getEntries();

let encodedBodySize = 0;
let transferSize = 0
resources.forEach(resource=>{
    if (resource.encodedBodySize){    
        encodedBodySize += resource.encodedBodySize
    }

    if (resource.transferSize){
        transferSize += resource.transferSize
    }
})

encodedBodySize = encodedBodySize/1024 //kilobyte
transferSize = transferSize/1024 //Kilobyte

let visitInstance = {
    "websiteName":window.location.href,
    "transferSize":transferSize,
    "pageLoadTime":pageLoadTime,
    "pageRenderTime":renderTime
}


browser.runtime.sendMessage({ from:"injectedScript",message:visitInstance });


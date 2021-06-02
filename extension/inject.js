const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

console.log(perfData)
console.log("Page Load Time: "+pageLoadTime)

// var startTime = new Date().getTime();

// function onLoadEventHandler() {  
//     //  var latency = startTime - performance.timing.navigationStart;  
//     const perfData = browser.performance.timing;
//      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

//      console.log('Latency = ' + latency + 'ms');  
// }

// onLoadEventHandler()


// console.log("****")
// console.log(perfData)
// console.log(pageLoadTime)
// // console.log("inject")


// // window.onload = function(){
// //     setTimeout(function(){
// //       var t = performance.timing;
// //       console.log(t.loadEventEnd - t.responseEnd);
// //     }, 0);
// //   }


// // var loadTime = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;
// // console.log(window.performance);
// // console.log("here*********")
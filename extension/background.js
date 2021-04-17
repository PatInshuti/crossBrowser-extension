// import tf from './tf.js'; 
browser = (function () {
    return window.browser || window.chrome;
})();

const Http = new XMLHttpRequest();
serverDomain = "10.225.86.123"
port = "4444"
const apiUrl=`http://${serverDomain}:${port}/receivelogs`;

var db;
let db_name = "capstone_plugin_v13"
let db_version = 1
let featureStore = "featureStore"
let hashCodeToScriptStore = "hashCodeToScriptStore"
let featureIndexMapping = {
    "addEventListener__createElement__getElementsByTagName__insertBefore__toString": 0,
    "onkeyup": 1,
    "appendChild__attachEvent__getElementsByTagName__open__removeChild": 2,
    "beginPath": 3,
    "addEventListener__appendChild__createElement__getAttribute__getElementsByTagName__toString": 4,
    "contains__createElement__remove__removeChild": 5,
    "add__forEach__replace__setAttribute": 6,
    "addEventListener__getElementById__replace__setAttribute": 7,
    "autofocus": 8,
    "appendChild__createElement__keys": 9,
    "appendChild__getAttribute__removeEventListener__replace": 10,
    "connection": 11,
    "appendChild__createElement__getAttribute__removeChild__replace__setAttribute": 12,
    "focus__getElementsByTagName__open__setAttribute__write": 13,
    "getClientRects": 14,
    "ch": 15,
    "preventDefault": 16,
    "appendChild__createElement__getElementById__getElementsByTagName__open__removeChild__setAttribute": 17,
    "addEventListener__attachEvent__getElementsByTagName__replace__toString": 18,
    "removeChild": 19,
    "appendChild__createElement__open__setTimeout": 20,
    "scrollTo": 21,
    "removeEventListener__setTimeout": 22,
    "Start": 23,
    "appendChild__focus__setAttribute__setTimeout": 24,
    "createElement__forEach__get__remove__replace__setAttribute": 25,
    "add__forEach__get": 26,
    "preventDefault__remove__replace": 27,
    "addEventListener__getElementsByTagName__open__setAttribute": 28,
    "attachEvent__createElement__getElementById__open": 29,
    "add__appendChild__remove": 30,
    "plugins": 31,
    "item": 32,
    "replace__stopPropagation": 33,
    "setAttributeNS": 34,
    "fetch": 35,
    "showModalDialog": 36,
    "opener": 37,
    "close": 38,
    "drawImage": 39,
    "getRootNode": 40,
    "createRadialGradient": 41,
    "addEventListener__createElement__querySelectorAll__replace": 42,
    "content": 43,
    "createProcessingInstruction": 44,
    "resizeBy": 45,
    "abort": 46,
    "reportValidity": 47,
    "createElement__getElementsByTagName__open": 48,
    "forEach__keys": 49,
    "stopImmediatePropagation": 50,
    "getUserMedia": 51,
    "createCaption": 52,
    "appendChild__createElement__open__setAttribute__write": 53,
    "arcTo": 54,
    "filter__find__get": 55,
    "media": 56,
    "minLength": 57,
    "xr": 58,
    "getAttribute": 59,
    "childNodes": 60,
    "lastEventId": 61,
    "scrollX": 62,
    "createObjectURL": 63,
    "filter__keys": 64,
    "cookieEnabled": 65,
    "clip": 66,
    "contains": 67,
    "contains__max__removeChild": 68,
    "filter__replace": 69,
    "nextNode": 70,
    "onblur": 71,
    "stroke": 72,
    "high": 73,
    "keydown": 74,
    "types": 75,
    "form": 76,
    "lineWidth": 77,
    "loadstart": 78,
    "language": 79,
    "cancelAnimationFrame": 80,
    "resize": 81,
    "compareDocumentPosition": 82,
    "show": 83,
    "input": 84,
    "addEventListener__postMessage": 85,
    "focusin": 86,
    "removeProp": 87,
    "fullscreenElement": 88,
    "elements": 89,
    "forEach": 90,
    "add__replace": 91,
    "nodeName": 92,
    "supports": 93,
    "javaEnabled": 94,
    "items": 95,
    "replaceState": 96,
    "setEndBefore": 97,
    "outerText": 98,
    "startTime": 99,
    "naturalWidth": 100,
    "data": 101,
    "host": 102,
    "control": 103,
    "getAnimations": 104,
    "deleteRow": 105,
    "paste": 106,
    "rules": 107,
    "setAttribute": 108,
    "length": 109,
    "placeholder": 110,
    "addColorStop": 111,
    "dispatchEvent": 112,
    "classList": 113,
    "fillRect": 114,
    "online": 115,
    "removeEventListener": 116,
    "isConnected": 117,
    "clearRect": 118,
    "formAction": 119,
    "kind": 120,
    "contextMenu": 121,
    "get": 122,
    "createTextNode": 123,
    "cancel": 124,
    "self": 125,
    "revokeObjectURL": 126,
    "normalize": 127,
    "releaseEvents": 128,
    "preload": 129,
    "cells": 130,
    "drop": 131,
    "label": 132,
    "play": 133,
    "cols": 134,
    "sizes": 135,
    "addEventListener": 136,
    "keypress": 137,
    "createPattern": 138,
    "properties": 139,
    "prepend": 140,
    "ontouchmove": 141,
    "createComment": 142,
    "width": 143,
    "customError": 144,
    "URL.1": 145,
    "caption": 146,
    "detach": 147,
    "innerHTML": 148,
    "onfocus": 149,
    "sortable": 150,
    "link": 151,
    "go": 152,
    "setImmediate": 153,
    "disabled": 154,
    "find": 155,
    "moveBy": 156,
    "step": 157,
    "addEventListener__find": 158,
    "mouseover": 159,
    "mode": 160,
    "pageshow": 161,
    "add": 162,
    "onclose": 163,
    "requestAnimationFrame": 164,
    "complete": 165,
    "releasePointerCapture": 166,
    "abbr": 167,
    "maximize": 168,
    "getFeature": 169,
    "selected": 170,
    "createDocument": 171,
    "document": 172,
    "save": 173,
    "userAgent": 174,
    "offsetWidth": 175,
    "children": 176,
    "ondrop": 177,
    "matchMedia": 178,
    "cloneNode": 179,
    "surroundContents": 180,
    "declare": 181,
    "clearInterval": 182,
    "mozGetAsFile": 183,
    "compact": 184,
    "lang": 185,
    "open": 186,
    "replaceChild": 187,
    "createElementNS": 188,
    "defaultMuted": 189,
    "mousemove": 190,
    "parentNode": 191,
    "adoptNode": 192,
    "cloneRange": 193,
    "type": 194,
    "top": 195,
    "stopPropagation": 196,
    "href": 197,
    "createElement__filter__remove": 198,
    "removeAttributeNS": 199,
    "clearData": 200,
    "onchange": 201,
    "frames": 202,
    "isEqualNode": 203,
    "deleteContents": 204,
    "insertAdjacentText": 205,
    "navigator": 206,
    "textContent": 207,
    "closest": 208,
    "stepUp": 209,
    "touchend": 210,
    "tabIndex": 211,
    "defer": 212,
    "scope": 213,
    "span": 214,
    "filter__max": 215,
    "onload": 216,
    "queryCommandSupported": 217,
    "contentDocument": 218,
    "timeline": 219,
    "setCapture": 220,
    "links": 221,
    "valid": 222,
    "history": 223,
    "share": 224,
    "firstElementChild": 225,
    "onmouseout": 226,
    "fastSeek": 227,
    "fullScreen": 228,
    "strokeRect": 229,
    "position": 230,
    "lastChild": 231,
    "isPointInStroke": 232,
    "filename": 233,
    "window": 234,
    "pseudo": 235,
    "reset": 236,
    "requestStorageAccess": 237,
    "slot": 238,
    "setTransform": 239,
    "beforeunload": 240,
    "default": 241,
    "getAttributeNames": 242,
    "scrollIntoView": 243,
    "as": 244,
    "unload": 245,
    "initEvent": 246,
    "showModal": 247,
    "atob": 248,
    "getElementsByClassName": 249,
    "putImageData": 250,
    "shape": 251,
    "requestIdleCallback": 252,
    "importNode": 253,
    "color": 254,
    "itemValue": 255,
    "domain": 256,
    "getElementsByTagName": 257,
    "touchcancel": 258,
    "name": 259,
    "submit": 260,
    "onshow": 261,
    "wheel": 262,
    "password": 263,
    "strokeText": 264,
    "className": 265,
    "onended": 266,
    "popstate": 267,
    "values": 268,
    "ontransitionend": 269,
    "invalid": 270,
    "addElement": 271,
    "quadraticCurveTo": 272,
    "getUserData": 273,
    "createHTMLDocument": 274,
    "scale": 275,
    "onstart": 276,
    "currentStyle": 277,
    "resizeTo": 278,
    "createNSResolver": 279,
    "focus": 280,
    "caretRangeFromPoint": 281,
    "areas": 282,
    "querySelector": 283,
    "images": 284,
    "setPointerCapture": 285,
    "parentElement": 286,
    "click": 287,
    "closed": 288,
    "checkValidity": 289,
    "whenDefined": 290,
    "getData": 291,
    "removeAttribute": 292,
    "download": 293,
    "frame": 294,
    "getAttributeNodeNS": 295,
    "get__keys": 296,
    "clearTimeout": 297,
    "moveTo": 298,
    "transitionend": 299,
    "method": 300,
    "allow": 301,
    "behavior": 302,
    "setUserData": 303,
    "minimize": 304,
    "toString": 305,
    "videoTracks": 306,
    "select": 307,
    "cookie": 308,
    "nextSibling": 309,
    "list": 310,
    "timeStamp": 311,
    "collapse": 312,
    "vAlign": 313,
    "pattern": 314,
    "filter": 315,
    "offsetParent": 316,
    "createExpression": 317,
    "onabort": 318,
    "defaultValue": 319,
    "overflow": 320,
    "profile": 321,
    "visibilityState": 322,
    "reason": 323,
    "insertAdjacentElement": 324,
    "blur": 325,
    "message": 326,
    "mouseout": 327,
    "hostname": 328,
    "define": 329,
    "font": 330,
    "attachEvent__postMessage": 331,
    "focusout": 332,
    "reload": 333,
    "createCDATASection": 334,
    "getElementsByName": 335,
    "protocol": 336,
    "contentType": 337,
    "getPreventDefault": 338,
    "headers": 339,
    "visibilitychange": 340,
    "all": 341,
    "refresh": 342,
    "rel": 343,
    "disconnect": 344,
    "mouseenter": 345,
    "dir": 346,
    "observe": 347,
    "version": 348,
    "createTouch": 349,
    "background": 350,
    "sorted": 351,
    "replace": 352,
    "takeRecords": 353,
    "setMediaKeys": 354,
    "body": 355,
    "setEndAfter": 356,
    "attributes": 357,
    "getElementsByTagNameNS": 358,
    "doNotTrack": 359,
    "scrollBy": 360,
    "setSelectionRange": 361,
    "mousedown": 362,
    "selectNodeContents": 363,
    "getDefaultComputedStyle": 364,
    "bezierCurveTo": 365,
    "storage": 366,
    "previousNode": 367,
    "nonce": 368,
    "hidden": 369,
    "sendBeacon": 370,
    "onerror": 371,
    "border": 372,
    "insertBefore": 373,
    "mouseup": 374,
    "evaluate": 375,
    "appendChild__querySelector": 376,
    "geolocation": 377,
    "checked": 378,
    "align": 379,
    "contextmenu": 380,
    "getElementById": 381,
    "toggle": 382,
    "autocomplete": 383,
    "onkeydown": 384,
    "writeln": 385,
    "createAttribute": 386,
    "previousSibling": 387,
    "remove": 388,
    "min": 389,
    "toolbar": 390,
    "product": 391,
    "insertAdjacentHTML": 392,
    "load": 393,
    "canPlayType": 394,
    "outerHTML": 395,
    "tagName": 396,
    "append__replace": 397,
    "getAttributeNS": 398,
    "endTime": 399,
    "createTreeWalker": 400,
    "back": 401,
    "error": 402,
    "stop": 403,
    "createRange": 404,
    "required": 405,
    "action": 406,
    "start": 407,
    "assign": 408,
    "track": 409,
    "openDialog": 410,
    "splitText": 411,
    "dateTime": 412,
    "description": 413,
    "alt": 414,
    "getSelection": 415,
    "value": 416,
    "wrap": 417,
    "namedItem": 418,
    "onresize": 419,
    "hasAttributes": 420,
    "composedPath": 421,
    "keyboard": 422,
    "dataset": 423,
    "transform": 424,
    "getContext": 425,
    "screen": 426,
    "hasChildNodes": 427,
    "index": 428,
    "previousElementSibling": 429,
    "requestMediaKeySystemAccess": 430,
    "dump": 431,
    "toBlob": 432,
    "alert": 433,
    "timeupdate": 434,
    "defaultPrevented": 435,
    "captureEvents": 436,
    "insertNode": 437,
    "execCommand": 438,
    "createDocumentFragment": 439,
    "naturalHeight": 440,
    "createElement": 441,
    "tooLong": 442,
    "event": 443,
    "y": 444,
    "cancelIdleCallback": 445,
    "animate": 446,
    "enabled": 447,
    "isMap": 448,
    "setCustomValidity": 449,
    "prompt": 450,
    "ellipse": 451,
    "reversed": 452,
    "target": 453,
    "onclick": 454,
    "coords": 455,
    "rotate": 456,
    "scoped": 457,
    "scrollHeight": 458,
    "createEvent": 459,
    "entries": 460,
    "isSupported": 461,
    "appendChild": 462,
    "setTimeout": 463,
    "fullscreen": 464,
    "source": 465,
    "mousewheel": 466,
    "restore": 467,
    "postMessage": 468,
    "localName": 469,
    "innerText": 470,
    "style": 471,
    "getComputedStyle": 472,
    "hasFocus": 473,
    "head": 474,
    "print": 475,
    "createImageData": 476,
    "canvas": 477,
    "offsetTop": 478,
    "addPath": 479,
    "search": 480,
    "max": 481,
    "compareBoundaryPoints": 482,
    "volume": 483,
    "dblclick": 484,
    "registerElement": 485,
    "suspend": 486,
    "controller": 487,
    "id": 488,
    "change": 489,
    "setTimeout__write": 490,
    "console": 491,
    "Event": 492,
    "accept": 493,
    "scroll": 494,
    "write": 495,
    "lookupNamespaceURI": 496,
    "onreset": 497,
    "hash": 498,
    "clearImmediate": 499,
    "setData": 500,
    "x": 501,
    "size": 502,
    "options": 503,
    "forward": 504,
    "nextElementSibling": 505,
    "keys": 506,
    "parent": 507
}
var featuresList =["addEventListener__createElement__getElementsByTagName__insertBefore__toString","onkeyup","appendChild__attachEvent__getElementsByTagName__open__removeChild","beginPath","addEventListener__appendChild__createElement__getAttribute__getElementsByTagName__toString","contains__createElement__remove__removeChild","add__forEach__replace__setAttribute","addEventListener__getElementById__replace__setAttribute","autofocus","appendChild__createElement__keys","appendChild__getAttribute__removeEventListener__replace","connection","appendChild__createElement__getAttribute__removeChild__replace__setAttribute","focus__getElementsByTagName__open__setAttribute__write","getClientRects","ch","preventDefault","appendChild__createElement__getElementById__getElementsByTagName__open__removeChild__setAttribute","addEventListener__attachEvent__getElementsByTagName__replace__toString","removeChild","appendChild__createElement__open__setTimeout","scrollTo","removeEventListener__setTimeout","Start","appendChild__focus__setAttribute__setTimeout","createElement__forEach__get__remove__replace__setAttribute","add__forEach__get","preventDefault__remove__replace","addEventListener__getElementsByTagName__open__setAttribute","attachEvent__createElement__getElementById__open","add__appendChild__remove","plugins","item","replace__stopPropagation","setAttributeNS","fetch","showModalDialog","opener","close","drawImage","getRootNode","createRadialGradient","addEventListener__createElement__querySelectorAll__replace","content","createProcessingInstruction","resizeBy","abort","reportValidity","createElement__getElementsByTagName__open","forEach__keys","stopImmediatePropagation","getUserMedia","createCaption","appendChild__createElement__open__setAttribute__write","arcTo","filter__find__get","media","minLength","xr","getAttribute","childNodes","lastEventId","scrollX","createObjectURL","filter__keys","cookieEnabled","clip","contains","contains__max__removeChild","filter__replace","nextNode","onblur","stroke","high","keydown","types","form","lineWidth","loadstart","language","cancelAnimationFrame","resize","compareDocumentPosition","show","input","addEventListener__postMessage","focusin","removeProp","fullscreenElement","elements","forEach","add__replace","nodeName","supports","javaEnabled","items","replaceState","setEndBefore","outerText","startTime","naturalWidth","data","host","control","getAnimations","deleteRow","paste","rules","setAttribute","length","placeholder","addColorStop","dispatchEvent","classList","fillRect","online","removeEventListener","isConnected","clearRect","formAction","kind","contextMenu","get","createTextNode","cancel","self","revokeObjectURL","normalize","releaseEvents","preload","cells","drop","label","play","cols","sizes","addEventListener","keypress","createPattern","properties","prepend","ontouchmove","createComment","width","customError","URL.1","caption","detach","innerHTML","onfocus","sortable","link","go","setImmediate","disabled","find","moveBy","step","addEventListener__find","mouseover","mode","pageshow","add","onclose","requestAnimationFrame","complete","releasePointerCapture","abbr","maximize","getFeature","selected","createDocument","document","save","userAgent","offsetWidth","children","ondrop","matchMedia","cloneNode","surroundContents","declare","clearInterval","mozGetAsFile","compact","lang","open","replaceChild","createElementNS","defaultMuted","mousemove","parentNode","adoptNode","cloneRange","type","top","stopPropagation","href","createElement__filter__remove","removeAttributeNS","clearData","onchange","frames","isEqualNode","deleteContents","insertAdjacentText","navigator","textContent","closest","stepUp","touchend","tabIndex","defer","scope","span","filter__max","onload","queryCommandSupported","contentDocument","timeline","setCapture","links","valid","history","share","firstElementChild","onmouseout","fastSeek","fullScreen","strokeRect","position","lastChild","isPointInStroke","filename","window","pseudo","reset","requestStorageAccess","slot","setTransform","beforeunload","default","getAttributeNames","scrollIntoView","as","unload","initEvent","showModal","atob","getElementsByClassName","putImageData","shape","requestIdleCallback","importNode","color","itemValue","domain","getElementsByTagName","touchcancel","name","submit","onshow","wheel","password","strokeText","className","onended","popstate","values","ontransitionend","invalid","addElement","quadraticCurveTo","getUserData","createHTMLDocument","scale","onstart","currentStyle","resizeTo","createNSResolver","focus","caretRangeFromPoint","areas","querySelector","images","setPointerCapture","parentElement","click","closed","checkValidity","whenDefined","getData","removeAttribute","download","frame","getAttributeNodeNS","get__keys","clearTimeout","moveTo","transitionend","method","allow","behavior","setUserData","minimize","toString","videoTracks","select","cookie","nextSibling","list","timeStamp","collapse","vAlign","pattern","filter","offsetParent","createExpression","onabort","defaultValue","overflow","profile","visibilityState","reason","insertAdjacentElement","blur","message","mouseout","hostname","define","font","attachEvent__postMessage","focusout","reload","createCDATASection","getElementsByName","protocol","contentType","getPreventDefault","headers","visibilitychange","all","refresh","rel","disconnect","mouseenter","dir","observe","version","createTouch","background","sorted","replace","takeRecords","setMediaKeys","body","setEndAfter","attributes","getElementsByTagNameNS","doNotTrack","scrollBy","setSelectionRange","mousedown","selectNodeContents","getDefaultComputedStyle","bezierCurveTo","storage","previousNode","nonce","hidden","sendBeacon","onerror","border","insertBefore","mouseup","evaluate","appendChild__querySelector","geolocation","checked","align","contextmenu","getElementById","toggle","autocomplete","onkeydown","writeln","createAttribute","previousSibling","remove","min","toolbar","product","insertAdjacentHTML","load","canPlayType","outerHTML","tagName","append__replace","getAttributeNS","endTime","createTreeWalker","back","error","stop","createRange","required","action","start","assign","track","openDialog","splitText","dateTime","description","alt","getSelection","value","wrap","namedItem","onresize","hasAttributes","composedPath","keyboard","dataset","transform","getContext","screen","hasChildNodes","index","previousElementSibling","requestMediaKeySystemAccess","dump","toBlob","alert","timeupdate","defaultPrevented","captureEvents","insertNode","execCommand","createDocumentFragment","naturalHeight","createElement","tooLong","event","y","cancelIdleCallback","animate","enabled","isMap","setCustomValidity","prompt","ellipse","reversed","target","onclick","coords","rotate","scoped","scrollHeight","createEvent","entries","isSupported","appendChild","setTimeout","fullscreen","source","mousewheel","restore","postMessage","localName","innerText","style","getComputedStyle","hasFocus","head","print","createImageData","canvas","offsetTop","addPath","search","max","compareBoundaryPoints","volume","dblclick","registerElement","suspend","controller","id","change","setTimeout__write","console","Event","accept","scroll","write","lookupNamespaceURI","onreset","hash","clearImmediate","setData","x","size","options","forward","nextElementSibling","keys","parent"]
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

// Get the website from url
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


const retrieve_SendBlockingInformation = () =>{

    let retrievedObject = localStorage.getItem('blockSettings');
    retrievedObject = JSON.parse(retrievedObject);

    browser.runtime.sendMessage({ from:"backgroundScript",message:retrievedObject });

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
            // await getFeatures('selectedFeatures.txt').then(_res => {

            //     lines = _res.split('\n');
                
            //     lines.forEach(async line=>{
            //         await featuresList.push(line)
            //     })
            // })
        
            //open the db 
            const request = window.indexedDB.open(db_name,db_version);

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



const runScriptLabelling = (db) =>{

    browser.webRequest.onBeforeRequest.addListener( (details) => {

        if (details.type == "script"){

            return new Promise(async (resolve, reject) => {

                let categoriesToBlock = [];

                if (localStorage.getItem('scriptBlockSettings') !== null){
    
                    let scriptBlockSettings = JSON.parse(localStorage.getItem('scriptBlockSettings'));

                    if (scriptBlockSettings == true){
                        categoriesToBlock = ["ads+marketing","social","analytics"]
                    }

                    console.log(categoriesToBlock)

                    hashValue = details.url;
                    var tx2 = db.transaction(hashCodeToScriptStore, 'readwrite');
                    var hashCodeToScriptDBStore = tx2.objectStore(hashCodeToScriptStore);
                    var getAllhashCodeToScript = hashCodeToScriptDBStore.get(hashValue);
                    
                    getAllhashCodeToScript.onsuccess = async (event) =>{
                        // Start intercepting requests
                        theMapping = event.target.result;
    
                        if (theMapping != undefined){
                            resolve({cancel: categoriesToBlock.includes(theMapping.label) ? true:false  })
                        }
    
                        else{
                            resolve({cancel:false})
                        }
                    }

                }

                else{
                    resolve({cancel:false})
                }
            
                // End of settings retrieval 




            })
        }

        else{
            return({cancel:false})
        }

    },
    {urls: ["<all_urls>"]},
    ["blocking"]);

}

setupDB();


// consider them as ** content ** --->> tag-manager+content * hosting+cdn * utility * customer-success
classes = ["ads+marketing", "tag-manager+content", "hosting+cdn", "video", "utility", "analytics", "social", "customer-success"]

tf.loadLayersModel(browser.extension.getURL("model/model.json")).then( model => {

    //open the db 
    const request = window.indexedDB.open(db_name,db_version);

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
            runScriptLabelling(db);
            labelOnComplete(db);
        }
    }

} );


const labelOnComplete = (db) =>{

    browser.webRequest.onCompleted.addListener((details)=>{

        if (details.type == "script"){

            let hashValue = (details.url);

            var tx2 = db.transaction(hashCodeToScriptStore, 'readwrite');
            var hashCodeToScriptDBStore = tx2.objectStore(hashCodeToScriptStore);
            var getAllhashCodeToScript = hashCodeToScriptDBStore.get(hashValue);

            getAllhashCodeToScript.onsuccess = async (event) =>{
                // Start intercepting requests
                theMapping = event.target.result;
                // First check if script hashcode exists in the objectStore
                if (theMapping == undefined){

                    // ============== THEN START A WEB WORKER HERE ===============
                    var myWorker = new Worker('./worker.js');

                    myWorker.postMessage({featuresList:featuresList, url:details.url, featureIndexMapping:featureIndexMapping, db_name:db_name, db_version:db_version, hashCodeToScriptStore:hashCodeToScriptStore });

                }
            }
        }

    }, { urls: ['<all_urls>'] }, []) 

}
const topPk = require("./data")


require('geckodriver');
const webdriver = require('selenium-webdriver');
let firefox = require('selenium-webdriver/firefox');
let firefoxOptions = new firefox.Options().addExtensions(`../extension/web-ext-artifacts/capstone.xpi`)

var capabilities = {
    browserName: 'firefox',
    'moz:firefoxOptions': {
        mobileEmulation: {
            deviceName: 'Samsung Galaxy S4'
        }
    }
};

let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(firefoxOptions)
    .withCapabilities(capabilities)
    .build();


// driver.get('http://betteraudition.com/');

let a = []

// topPk.forEach(website => {
//     driver.get(website);
// });

driver.get(topPk[0]);
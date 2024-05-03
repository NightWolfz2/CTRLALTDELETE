const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

// Function to take screenshots
async function takeScreenshot(driver, filename) {
    let image = await driver.takeScreenshot();
    //fs.writeFileSync(filename, image, 'base64');
    fs.writeFileSync('C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\${}', image, 'base64');
}

// Function to clear browser data
async function clearBrowserData(driver) {
    await driver.manage().deleteAllCookies();
    try {
        await driver.executeScript("window.sessionStorage.clear();");
        await driver.executeScript("window.localStorage.clear();");
    } catch (error) {
        console.log("Could not clear sessionStorage or localStorage");
    }
}

// The main test function
async function testHomePage() {
    let options = new chrome.Options();
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    // Add other Chrome options as needed

    try {
        await clearBrowserData(driver);

        await driver.get('http://localhost:3000/login');
        console.log("Navigated to login page.");
        
        await driver.findElement(By.id('emailInput')).sendKeys('nikolay.chkhaylo@yahoo.com');
        await driver.findElement(By.id('passwordInput')).sendKeys('TheColaman3@', Key.RETURN);
        console.log("Credentials entered and submitted.");

        await driver.wait(until.urlIs('http://localhost:3000/'), 30000);
        console.log("Navigated to home page.");

        // Take a screenshot after a successful login
        await takeScreenshot(driver, 'C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\screenshot.png');
        console.log("Screenshot taken after successful login.");

        // Apply filters
        await driver.findElement(By.linkText('Calendar')).click();
        await driver.wait(until.urlIs('http://localhost:3000/overview'), 30000);
        console.log("Navigated to Calendar page.");

    } catch (error) {
        console.error('An error occurred:', error);
        //await takeScreenshot(driver, 'C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\screenshot.png');
        console.log("Screenshot taken on error.");
    } finally {
        // Uncomment the line below if you want to close the browser after the tests
        //await driver.quit();
    }
}

testHomePage();


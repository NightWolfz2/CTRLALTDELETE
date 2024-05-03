const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function takeScreenshot(driver, filename) {
    let image = await driver.takeScreenshot();
    fs.writeFileSync(filename, image, 'base64');
}

async function clearBrowserData(driver) {
    await driver.manage().deleteAllCookies();
    try {
        await driver.executeScript("window.sessionStorage.clear();");
        await driver.executeScript("window.localStorage.clear();");
    } catch (error) {
        console.log("Could not clear sessionStorage or localStorage");
    }
}

async function testHomePage() {
    let options = new chrome.Options();
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await clearBrowserData(driver);
        await driver.get('http://localhost:3000/login');
        console.log("Navigated to login page.");

        // Explicitly wait for the email input to be present and visible
        await driver.wait(until.elementLocated(By.id('emailInput')), 10000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('emailInput'))), 10000);

        await driver.findElement(By.id('emailInput')).sendKeys('nikolay.chkhaylo@yahoo.com');
        await driver.findElement(By.id('passwordInput')).sendKeys('TheColaman3@', Key.RETURN);
        console.log("Credentials entered and submitted.");

        await driver.wait(until.urlIs('http://localhost:3000/'), 30000);
        console.log("Navigated to home page.");

        // Additional test steps...

    } catch (error) {
        console.error('An error occurred:', error);
        await takeScreenshot(driver, 'error_screenshot.png');
    } finally {
        await driver.quit();
    }
}

testHomePage();
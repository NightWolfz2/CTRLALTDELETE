const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

// Function to take screenshots
async function takeScreenshot(driver, filename) {
    let image = await driver.takeScreenshot();
    //fs.writeFileSync(filename, image, 'base64');
    fs.writeFileSync('C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\${filename}', image, 'base64');
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
        
        //await driver.wait(until.elementLocated(By.id('emailInput')), 10000); // waits up to 10 seconds

        await driver.findElement(By.id('emailInput')).sendKeys('nikolay.chkhaylo@yahoo.com');
        await driver.findElement(By.id('passwordInput')).sendKeys('TheColaman3@', Key.RETURN);
        console.log("Credentials entered and submitted.");

        await driver.wait(until.urlIs('http://localhost:3000/'), 30000);
        console.log("Navigated to home page.");

        // Take a screenshot after a successful login
        await takeScreenshot(driver, 'C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\screenshot.png');
        console.log("Screenshot taken after successful login.");

        // Apply filters
        await driver.findElement(By.id('status')).sendKeys('In Progress', Key.RETURN);
        console.log("Status filter set to 'In Progress'.");

        await driver.findElement(By.id('priority')).sendKeys('High', Key.RETURN);
        console.log("Priority filter set to 'High'.");

        const dueDateInput = await driver.findElement(By.id('due-date'));
        await dueDateInput.clear();
        await dueDateInput.sendKeys('2024-06-30', Key.RETURN);
        console.log("Due date filter set.");

        const searchBar = await driver.findElement(By.id('search'));
        await searchBar.sendKeys('Test', Key.RETURN);
        console.log("Search term 'Test' entered.");

        // Take a screenshot after applying filters
        await takeScreenshot(driver, 'C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\screenshot.png');
        console.log("Screenshot taken after applying filters.");

        // Click the "Reset Filters" button
        const resetButton = await driver.findElement(By.xpath("//button[text()='Reset Filters']"));
        await resetButton.click();
        console.log("Filters reset.");

        // Take a screenshot after resetting filters
        await takeScreenshot(driver, 'C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\screenshot.png');
        console.log("Screenshot taken after resetting filters.");

    } catch (error) {
        console.error('An error occurred:', error);
        await takeScreenshot(driver, 'C:\\Users\\nikol\\Documents\\GitHub\\CtrlAltDelete\\frontend\\screenshots\\screenshot.png');
        console.log("Screenshot taken on error.");
    } finally {
        // Uncomment the line below if you want to close the browser after the tests
        //await driver.quit();
    }
}

testHomePage();


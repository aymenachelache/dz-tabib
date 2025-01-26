const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Login Page Test", function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should log in successfully", async function () {
    await driver.get("https://dz-tabib-unot.vercel.app/login");

    // Find input fields and submit button
    const usernameInput = await driver.findElement(By.id("username"));
    const passwordInput = await driver.findElement(By.id("password"));
    const submitButton = await driver.findElement(By.css("button[type='submit']"));

    // Enter credentials
    await usernameInput.sendKeys("testuser");
    await passwordInput.sendKeys("testpassword");

    // Submit the form
    await submitButton.click();

    // Wait for navigation and check URL
    await driver.wait(until.urlIs("https://dz-tabib-unot.vercel.app/"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal("https://dz-tabib-unot.vercel.app/");
  });

  after(async function () {
    await driver.quit();
  });
});
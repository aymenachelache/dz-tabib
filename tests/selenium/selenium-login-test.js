import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("Login Page Test", function () {
  let driver;

  before(async function () {
    console.log("Setting up driver...");
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should log in successfully", async function () {
    console.log("Navigating to login page...");
    await driver.get("https://dz-tabib-unot.vercel.app/login");

    console.log("Finding input fields and submit button...");
    const usernameInput = await driver.findElement(By.id("username"));
    const passwordInput = await driver.findElement(By.id("password"));
    const submitButton = await driver.findElement(By.css("button[type='submit']"));

    console.log("Entering credentials...");
    await usernameInput.sendKeys("testuser");
    await passwordInput.sendKeys("testpassword");

    console.log("Submitting the form...");
    await submitButton.click();

    console.log("Waiting for navigation...");
    await driver.wait(until.urlIs("https://dz-tabib-unot.vercel.app/"), 5000);

    console.log("Checking current URL...");
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal("https://dz-tabib-unot.vercel.app/");
  });

  after(async function () {
    console.log("Quitting driver...");
    await driver.quit();
  });
});
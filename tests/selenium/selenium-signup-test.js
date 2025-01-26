import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("SignUp Page Test", function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should sign up successfully", async function () {
    await driver.get("https://dz-tabib-unot.vercel.app/signup");

    // Find input fields and submit button
    const firstNameInput = await driver.findElement(By.id("first_name"));
    const lastNameInput = await driver.findElement(By.id("last_name"));
    const usernameInput = await driver.findElement(By.id("username"));
    const emailInput = await driver.findElement(By.id("email"));
    const passwordInput = await driver.findElement(By.id("password"));
    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    const submitButton = await driver.findElement(By.css("button[type='submit']"));

    // Fill out the form
    await firstNameInput.sendKeys("John");
    await lastNameInput.sendKeys("Doe");
    await usernameInput.sendKeys("johndoe");
    await emailInput.sendKeys("johndoe@example.com");
    await passwordInput.sendKeys("password123");
    await confirmPasswordInput.sendKeys("password123");

    // Submit the form
    await submitButton.click();

    // Wait for navigation and check URL
    await driver.wait(until.urlIs("https://dz-tabib-unot.vercel.app/login"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal("https://dz-tabib-unot.vercel.app/login");
  });

  after(async function () {
    await driver.quit();
  });
});
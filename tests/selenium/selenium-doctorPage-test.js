import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import chrome from "selenium-webdriver/chrome.js"; // Import chrome module with .js extension

describe("Doctors Page Test", function () {
  let driver;

  before(async function () {
    // Specify the path to ChromeDriver if it's not in the system PATH
    const service = new chrome.ServiceBuilder("C:/path/to/chromedriver.exe"); // Update the path to your chromedriver
    const options = new chrome.Options();

    // Build the driver with specified service and options
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  });

  it("should display doctors and paginate", async function () {
    await driver.get("https://dz-tabib-unot.vercel.app/doctors");

    // Wait for doctor cards to load
    await driver.wait(until.elementLocated(By.css(".DoctorCard")), 5000);
    const doctorCards = await driver.findElements(By.css(".DoctorCard"));
    expect(doctorCards.length).to.be.greaterThan(0);

    // Test pagination (if applicable)
    const nextButton = await driver.findElement(By.xpath("//button[contains(text(), 'Next')]"));
    await nextButton.click();

    // Wait for the next page to load
    await driver.wait(until.urlContains("page=2"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("page=2");
  });

  after(async function () {
    await driver.quit();
  });
});
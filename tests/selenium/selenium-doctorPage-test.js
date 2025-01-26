import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("Doctors Page Test", function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
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
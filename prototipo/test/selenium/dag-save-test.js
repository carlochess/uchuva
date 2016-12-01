var assert = require('assert');
var selenium = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var driver;

var timeOut = 150000;
// http://testerstories.com/2016/02/javascript-with-selenium-webdriver-and-mocha/

// java -jar selenium-server-standalone-2.45.0.jar

test.before(function() {
  this.timeout(timeOut);
  driver = new selenium.Builder().
      withCapabilities(selenium.Capabilities.chrome()).
      //usingServer('http://localhost:4444/wd/hub').
      build();
});

test.after(function() {
  driver.quit();
});

test.describe('Unsuccess Login', function(done) {
  test.it('aa aa', function() {
    this.timeout(timeOut);
    driver.get("http://localhost:3000/login");
    var login = driver.findElement(selenium.By.id('username'));
    var password = driver.findElement(selenium.By.id('password'));
    var btn_login = driver.findElement(selenium.By.id('btn-login'));
    login.sendKeys("admin");
    password.sendKeys("admin");
    btn_login.click();
    var createdag= driver.findElement(selenium.By.id('createdag'));
    createdag.click();

    driver.actions().
      keyDown(selenium.Key.SHIFT).
      mouseMove({x: 200, y:200}).
      click().
      keyUp(selenium.Key.SHIFT).
      perform();

      var save_input= driver.findElement(selenium.By.id('save-input'));
      save_input.click();
    driver.sleep(2000);
  });
});

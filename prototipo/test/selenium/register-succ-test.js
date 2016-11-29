var assert = require('assert');
var selenium = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var driver;

var timeOut = 15000;
// http://testerstories.com/2016/02/javascript-with-selenium-webdriver-and-mocha/

// java -jar selenium-server-standalone-2.45.0.jar

test.beforeEach(function() {
  this.timeout(timeOut);
  driver = new selenium.Builder().
      withCapabilities(selenium.Capabilities.chrome()).
      build();
  driver.get("http://localhost:3000/register");
});

test.afterEach(function() {
  driver.quit();
});

test.describe('Sucess registrations', function(done) {
  var validUsernames = "arrr,admin45,455589,______".split(",");

  validUsernames.forEach(function(username){
    test.it('Success register name '+ username, function() {
      var login = driver.findElement(selenium.By.id('username'));
      var password = driver.findElement(selenium.By.id('password'));
      var btn_login = driver.findElement(selenium.By.id('btn-login'));
      login.sendKeys(username);
      password.sendKeys("password");
      btn_login.click();
      driver.wait(function(){
        return driver.findElement(selenium.By.id('welcome'));
      },6000);
    });
  });
});

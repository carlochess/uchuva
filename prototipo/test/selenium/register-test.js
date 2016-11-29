var assert = require('assert');
var selenium = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var driver;

var timeOut = 15000;
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

test.describe('Failed registrations', function(done) {
  var invalidUsernames = "ar,,45/*/+91235,asdasdasdasdasdasd".split(",");

  invalidUsernames.forEach(function(username){
    test.it('Unsuccess register name '+ username, function() {
      driver.get("http://localhost:3000/register");
      var login = driver.findElement(selenium.By.id('username'));
      var password = driver.findElement(selenium.By.id('password'));
      var btn_login = driver.findElement(selenium.By.id('btn-login'));
      login.sendKeys(username);
      password.sendKeys("password");
      btn_login.click();
      driver.wait(function(){
        return driver.findElements(selenium.By.css('div.alert.alert-danger')).then(function(result) {
          return result[0];
        });
      },4000);
    });
  });

  test.it('Unsuccess register password', function() {
    driver.get("http://localhost:3000/register");
    var login = driver.findElement(selenium.By.id('username'));
    var password = driver.findElement(selenium.By.id('password'));
    var btn_login = driver.findElement(selenium.By.id('btn-login'));
    login.sendKeys("aa");
    password.sendKeys("aa");
    btn_login.click();
    driver.wait(function(){
      return driver.findElements(selenium.By.css('div.alert.alert-danger')).then(function(result) {
        return result[0];
      });
    },2000);
  });

});

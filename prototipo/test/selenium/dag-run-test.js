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

test.describe('Run a dag', function(done) {
  test.it('Run a simple node dag', function() {
    this.timeout(timeOut);
    driver.get("http://localhost:3000/login");
    var login = driver.findElement(selenium.By.id('username'));
    var password = driver.findElement(selenium.By.id('password'));
    var btn_login = driver.findElement(selenium.By.id('btn-login'));
    login.sendKeys("admin");
    password.sendKeys("admin");
    btn_login.click();
    driver.sleep(1000);
    var createdag= driver.findElement(selenium.By.id('createdag'));
    var nodos = [{
        x : 200,
        y : 200,
        programa : "cat"
    }];
    createdag.click();
    var nodo = nodos[0];

          driver.actions().
              keyDown(selenium.Key.SHIFT).
              mouseMove({x: nodo.x, y:nodo.y}).
              click().
              keyUp(selenium.Key.SHIFT).
              perform();
      driver.sleep(1000);
      driver.actions().
              mouseMove({x: nodo.x+20, y:nodo.y}).
              click().
              perform();
      console.log("Click en el menu lateral");
          var menuLateral= driver.findElement(selenium.By.id('openMenu'));
          menuLateral.click();
          driver.sleep(1000);
          driver.executeScript("document.getElementById('plantillaPrograma').setAttribute('value', '"+nodo.programa+"')");

      /*     driver.actions().
              keyDown(selenium.Key.SHIFT).
              mouseMove({x: nodo.x+20, y:nodo.y}).
              click().
              keyUp(selenium.Key.SHIFT).
              perform();
      driver.sleep(1000);
      console.log("Click en el menu lateral");
          var menuLateral= driver.findElement(selenium.By.id('openMenu'));
          menuLateral.click();
          driver.sleep(1000);
          driver.executeScript("document.getElementById('plantillaPrograma').setAttribute('value', '"+nodo.programa+"')");
       */


    var save_input= driver.findElement(selenium.By.id('save-input'));
    save_input.click();
    driver.wait(function(){
        return driver.findElements(
          selenium.By.css('div.col-xs-11.col-sm-4.alert.alert-info.animated.fadeInDown')
        ).then(function(result) {
          result[0].getText().then(function(texto){
            console.log(texto);
          });
          return result[0];
        });
    },4000);
  });
});

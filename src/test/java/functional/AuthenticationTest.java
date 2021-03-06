package functional;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

class AuthenticationTest {

  private WebDriver webDriver;
  private String baseUrl;

  @BeforeAll
  public static void setUpChromeDriver() {
    WebDriverManager.chromedriver().setup();
  }

  @BeforeEach
  public void setUpWebDriver() {
    webDriver = new ChromeDriver();
    baseUrl = "http://localhost/login";
  }

  @AfterEach
  public void quitWebDriver() {
    if (webDriver != null) {
      webDriver.quit();
    }
  }

  @Disabled
  @Test
  public void authenticateUserGoodPseudoAndGoodPassword() {
    webDriver.get(baseUrl);
    // On récupère les champs du formulaire de connexion
    final WebElement pseudoField = webDriver.findElement(By.id("login"));
    final WebElement passwordField = webDriver.findElement(By.id("password"));
    final WebElement submitButton = webDriver.findElement(By.id("btn"));

    // On remplit le formulaire avec les éléments souhaités
    pseudoField.sendKeys("test");
    passwordField.sendKeys("test");
    submitButton.click();

    // Va nous faire attendre 5 secondes
    final WebDriverWait waiter = new WebDriverWait(webDriver, 5);
    // On récupère la réponse attendue
    final WebElement solutionElement =
        waiter.until(ExpectedConditions.presenceOfElementLocated(By.id("pseudo")));
    final String solution = solutionElement.getText();
    // On vérifie que c'est correct
    assertAll(() -> assertTrue(solution.equals("test")));
  }

  @Disabled
  @Test
  public void authenticateUserEmptyPseudoAndEmptyPassword() {
    webDriver.get(baseUrl);
    final WebElement pseudoField = webDriver.findElement(By.id("login"));
    final WebElement passwordField = webDriver.findElement(By.id("password"));
    final WebElement submitButton = webDriver.findElement(By.id("btn"));

    // Va servir a enlever les attributs required du form
    JavascriptExecutor executor = (JavascriptExecutor) webDriver;
    executor.executeScript("window.document.getElementById(\"login\").required = false;");
    executor.executeScript("window.document.getElementById(\"password\").required = false;");

    pseudoField.sendKeys("");
    passwordField.sendKeys("");
    submitButton.click();


    final WebDriverWait waiter = new WebDriverWait(webDriver, 5);
    final WebElement solutionElement =
        waiter.until(ExpectedConditions.presenceOfElementLocated(By.id("errorBoard")));

    final String solution = solutionElement.getText();
    assertAll(() -> assertTrue(solution.equals("Veuillez remplir les champs")));
  }

  @Disabled
  @Test
  public void authenticateUserGoodPseudoAndBadPassword() {
    webDriver.get(baseUrl);
    final WebElement pseudoField = webDriver.findElement(By.id("login"));
    final WebElement passwordField = webDriver.findElement(By.id("password"));
    final WebElement submitButton = webDriver.findElement(By.id("btn"));

    pseudoField.sendKeys("test");
    passwordField.sendKeys("badPassword");
    submitButton.click();

    final WebDriverWait waiter = new WebDriverWait(webDriver, 5);
    final WebElement solutionElement =
        waiter.until(ExpectedConditions.presenceOfElementLocated(By.id("errorBoard")));
    final String solution = solutionElement.getText();
    assertAll(() -> assertTrue(solution.equals("Pseudo ou mot de passe incorrect")));
  }

}

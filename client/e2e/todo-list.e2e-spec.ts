import {TodoPage} from './todo-list.po';
import {browser, protractor} from 'protractor';

let origFn = browser.driver.controlFlow().execute;

//https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  //This delay is only put here so that you can watch the browser do its' thing.
  //If you're tired of it taking long you can remove this call
  origFn.call(browser.driver.controlFlow(), function () {
    return protractor.promise.delayed(0);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('should get and highlight Todo Name attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('should type something in filter owner box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeAnOwner("l");
    expect(page.getUniqueTodo("58af3a600343927e48e8720f")).toEqual("Blanche");
    page.backspace();
    page.typeAnOwner("Barry");
    expect(page.getUniqueTodo("58af3a600343927e48e87214")).toEqual("Barry");
  });

  it('should type a category and return 79 elements and 13 Fry and 16 dawn', () => {
    page.navigateTo();
    page.getTodoByCategory('homework');

    expect(page.getUniqueTodo("58af3a600343927e48e8721d")).toEqual("Dawn");

    expect(page.getUniqueTodo("58af3a600343927e48e87221")).toEqual("Fry");

  });

  it('should type in complete and return 143 elements with 27 Fry', () => {
    page.navigateTo();
    page.getTodoByStatus('complete');
    expect(page.getUniqueTodo("58af3a600343927e48e87237")).toEqual("Fry")
  });

  it('should type in incomplete and return 157 elements with 31 Workman', () => {
    page.navigateTo();
    page.getTodoByStatus('incomplete');
    expect(page.getUniqueTodo("58af3a600343927e48e87222")).toEqual("Workman")
  });

  it('should type in anim and return 94 elements with 18 Roberta', () => {
    page.navigateTo();
    page.getTodoByBody('anim');
    expect(page.getUniqueTodo("58af3a600343927e48e87224")).toEqual("Roberta")
  });

});

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
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999999;

  });

  it('should get and highlight Todo Name attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });


  it('Should have an add todo button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewTodo')).toBeTruthy();
  });


  it('Should open a dialog box when add todo button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-todo')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewTodo');
    expect(page.elementExistsWithCss('add-todo')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Todo', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewTodo');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
      page.navigateTo();
      page.click('addNewTodo');
      page.field('ownerField').sendKeys('123456OwnerOwner');
      // Need to clear the status field because the default value is false.
      page.field('statusField').clear();
      page.field('statusField').sendKeys('true');
      page.field('bodyField').sendKeys('body text');
      page.field('categoryField').sendKeys('homework');
      expect(page.button('confirmAddTodoButton').isEnabled()).toBe(true);
      page.click('confirmAddTodoButton');
      //Does not actually do a good job of checking whether it actually adds a to-do
      //This and the test below could both pass if it added one to-do with these fields,
      //but doesn't add one on subsequent attempts, which is not the behavior we want

    });

    it('should type something in filter owner box and check that it returned correct element', () => {
      page.navigateTo();
      page.typeAnOwner("123456OwnerOwner");
      page.getTodoByBody('body text');
      page.getTodoByCategory('homework');
      expect(page.getTodoByClass()).toEqual("123456OwnerOwner");
    });



    it('should type something in filter owner box and check that it returned correct element', () => {
      page.navigateTo();
      page.typeAnOwner("l");
      expect(page.getTodoByClass()).toEqual("Blanche");
      page.backspace();
      page.typeAnOwner("Barry");
      expect(page.getTodoByClass()).toEqual("Barry");
    });

    it('should type a category and return top value Blanche', () => {
      page.navigateTo();
      page.getTodoByCategory('homework');

      expect(page.getTodoByClass()).toEqual("Blanche");


    });

    it('should type in complete and return top result Blanche', () => {
      page.navigateTo();
      page.getTodoByStatus('complete');
      expect(page.getTodoByClass()).toEqual("Blanche");
    });

    it('should type in incomplete and return top result Fry', () => {
      page.navigateTo();
      page.getTodoByStatus('incomplete');
      expect(page.getTodoByClass()).toEqual("Fry");
    });

    it('should type in anim and return top result Fry', () => {
      page.navigateTo();
      page.getTodoByBody('anim');
      expect(page.getTodoByClass()).toEqual("Fry");
    });


  });
});

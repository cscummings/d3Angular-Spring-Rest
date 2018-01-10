import { D3AngularSpringRestPage } from './app.po';

describe('d3-angular-spring-rest App', function() {
  let page: D3AngularSpringRestPage;

  beforeEach(() => {
    page = new D3AngularSpringRestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

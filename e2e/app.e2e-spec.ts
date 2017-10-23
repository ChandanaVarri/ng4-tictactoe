import { Ng4TictactoePage } from './app.po';

describe('ng4-tictactoe App', () => {
  let page: Ng4TictactoePage;

  beforeEach(() => {
    page = new Ng4TictactoePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

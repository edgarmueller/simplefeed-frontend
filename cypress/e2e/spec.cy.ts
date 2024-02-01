describe('register user', () => {
  it('passes', async () => {
    cy.visit('http://127.0.0.1:5173/sign-up')
    cy.get('input[id="input-email"]').type('zoidberg@example.com')
    cy.get('input[id="input-username"]').type('zoidberg')
    cy.get('input[id="input-first-name"]').type('John')
    cy.get('input[id="input-last-name"]').type('Zoidberg')
    cy.get('input[id="input-password"]').type('Test1234')
    cy.get('input[id="input-confirm-password"]').type('Test1234')
    cy.get('button[id="btn-sign-up"]').click();
    cy.get('a').click();
  })
})
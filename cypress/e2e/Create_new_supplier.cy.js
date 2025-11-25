describe('New Supplier ', () => {
it('Creates a new supplier', () => {
cy.visit('http://100.64.34.39:8005/login?redirect-to=%2F#login', {
  headers: {
    "Accept-Encoding": "gzip, deflate"
  }
})


//Clear the feilds

cy.get('#login_email').clear()
cy.get('#login_password').clear()

 // intercept login API call
    cy.intercept('POST', '/login').as('loginRequest')

    // Login
    cy.get('#login_email').type('administrator')
    cy.get('#login_password').type('admin')
    cy.get('#page-login > div > main > div.page_content > div > section.for-login > div.login-content.page-card > form > div > div.page-card-actions > button')
      .click()

    // wait for login request to finish and assert it returned success
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)

    cy.url().should('not.include', '/login')


// Assert successful login (redirect to dashboard/home)
cy.url().should('eq', 'http://100.64.34.39:8005/')

cy.visit('http://100.64.34.39:8005/app')

cy.wait(5000)

cy.get('#navbar-search').click()

cy.get('#navbar-search').type('Supplier')

cy.get('a[href="/app/supplier"]').click()

cy.wait(2000)

cy.get('button[data-label="Add Supplier"]').click()

cy.wait(1000)

cy.get('.modal-dialog').within(() => {
  cy.contains('button', /Edit\s*Full\s*Form/i).click({ force: true });
});

cy.wait(1000)

const num = Math.floor(10 + Math.random() * 90)
cy.get('input[data-fieldname="supplier_name"]:visible')
  .type(`TestSupplier${num}`, { force: true })



cy.get('input[data-fieldname="supplier_group"]:visible').type('All Supplier Groups')

cy.get('select[data-fieldname="supplier_type"]:visible').select('Company')

cy.get('input[data-fieldname="default_currency"]:visible')
  .type('PKR')

  cy.get('input[data-fieldname="default_price_list"]:visible')
  .type('Standard Buying')

  cy.get('input[data-fieldname="default_bank_account"]:visible')
  .type('Habib Bank Limited - Habib Bank Limited')

  cy.get('a[href="#supplier-tax_tab"]').click()

  cy.wait(500)

const taxNum = Math.floor(10 + Math.random() * 90)
cy.get('input[data-fieldname="tax_id"]:visible').type(`${taxNum}`)

cy.get('button[data-label="Save"]').click()










})
})

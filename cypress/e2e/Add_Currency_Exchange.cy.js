describe('Currency Exchange ', () => {
it('Creates a new Currency exchange', () => {
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

cy.get('#navbar-search').type('Currency Exchange')

cy.wait(500)

cy.get('a[href="/app/currency-exchange"]').click()

cy.wait(3000)

cy.url().should('eq', 'http://100.64.34.39:8005/app/currency-exchange')


cy.get('button[data-label="Add Currency Exchange"]').click()

cy.get('.modal-dialog').within(() => {
  cy.contains('button', /Edit\s*Full\s*Form/i).click({ force: true });
})

cy.wait(1000)

cy.get('button[data-dismiss="modal"]', { timeout: 5000 }).click({ force: true })

const today = new Date()
const formatted =
  String(today.getDate()).padStart(2, '0') + '-' +
  String(today.getMonth() + 1).padStart(2, '0') + '-' +
  today.getFullYear()

cy.typeDateField('date', formatted)
cy.get('body').click(0,0)


cy.get('input[data-fieldname="from_currency"]:visible')
  .clear()
  .type('USD', { force: true })

  cy.get('input[data-fieldname="to_currency"]:visible')
  .clear()
  .type('PKR', { force: true })

  cy.get('input[data-fieldname="exchange_rate"]:visible')
  .clear()
  .type('281', { force: true })

  cy.get('button[data-label="Save"]').click()






})
})
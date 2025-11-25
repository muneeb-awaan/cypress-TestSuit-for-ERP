describe('Inara Login ', () => {
it('Login Test Case', () => {
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

})
})
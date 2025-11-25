describe('Adding lead ', () => {
it('Adds a lead', () => {
cy.visit('http://100.64.34.39:8005/login?redirect-to=%2F#login', {
  headers: {
    "Accept-Encoding": "gzip, deflate"
  }
})

// Enter Right details

cy.get('#login_email').type('administrator');
cy.get('#login_password').type('admin');

cy.get('#page-login > div > main > div.page_content > div > section.for-login > div.login-content.page-card > form > div > div.page-card-actions > button').click();

cy.wait(50000)

cy.visit('http://100.64.34.39:8005/app/lending')

  cy.get('#navbar-search').click().type('Lead List')


  // click the result
  cy.contains('#awesomplete_list_1 > li:nth-child(1) > a', 'Lead List', { timeout: 3000 })
    .should('be.visible')
    .click()

  // assert you landed on the Lead List page
  cy.url().should('include', 'http://100.64.34.39:8005/app/lead') 
  
  cy.wait(20000)


//click add lead

 cy.get('button[data-label="Add Lead"]').click();

 //Assertion to make sure we are on add lead page
cy.get('#page-Lead h3', { timeout: 2000 })
  .should('have.text', 'New Lead');


  // Form Filling
 
cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(2) > div > div.control-input-wrapper > div.control-input > input').type('Web Dev')

cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(1) > form > div:nth-child(3) > div > div.control-input-wrapper > div.control-input > div > div > input').type('Mr')

cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(3) > div > div.control-input-wrapper > div.control-input > div > div > input').type('Male')


cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(1) > form > div:nth-child(4) > div > div.control-input-wrapper > div.control-input > input').type('Muneeb')

cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(4) > div > div.control-input-wrapper > div.control-input > div > div > input').type('Reference')

cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(3) > form > div:nth-child(4) > div > div.control-input-wrapper > div.control-input.flex.align-center > select').select('Client')
  .should('have.value', 'Client')

cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(3) > form > div:nth-child(5) > div > div.control-input-wrapper > div.control-input.flex.align-center > select').select('Other')
  .should('have.value', 'Other')

cy.get('#lead-__details > div:nth-child(1) > div > div:nth-child(1) > form > div:nth-child(6) > div > div.control-input-wrapper > div.control-input > input').type('Awan')


cy.get('#lead-__details > div:nth-child(2) > div.section-body > div:nth-child(1) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > input').type('abc123@gmail.com')

cy.get('#lead-__details > div:nth-child(2) > div.section-body > div:nth-child(2) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > input').type('123456')

cy.get('#lead-__details > div:nth-child(2) > div.section-body > div:nth-child(3) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > input').type('030982728')

cy.get('#lead-__details > div:nth-child(2) > div.section-body > div:nth-child(1) > form > div:nth-child(2) > div > div.control-input-wrapper > div.control-input > input').type('www.abc.com')

cy.get('#lead-__details > div:nth-child(2) > div.section-body > div:nth-child(2) > form > div:nth-child(2) > div > div.control-input-wrapper > div.control-input > input').type('0308782782')

cy.get('#lead-__details > div:nth-child(3) > div.section-body > div:nth-child(1) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > input').type('TechTower')

cy.get('#lead-__details > div:nth-child(3) > div.section-body > div:nth-child(2) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > input').type('230000')

cy.get('#lead-__details > div:nth-child(3) > div.section-body > div:nth-child(3) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > div > div > input').type('Pakistan')

cy.get('#lead-__details > div:nth-child(3) > div.section-body > div:nth-child(2) > form > div:nth-child(2) > div > div.control-input-wrapper > div.control-input > div > div > input').type('Technology')

cy.get('#lead-__details > div:nth-child(3) > div.section-body > div:nth-child(3) > form > div:nth-child(2) > div > div.control-input-wrapper > div.control-input > input').type('abcnbn')

cy.get('#lead-__details > div:nth-child(3) > div.section-body > div:nth-child(2) > form > div:nth-child(3) > div > div.control-input-wrapper > div.control-input > div > div > input').type('Upper Income')

//Submit form

cy.get('#page-Lead > div.page-head.flex > div > div > div.flex.col.page-actions.justify-content-end > div.standard-actions.flex > button.btn.btn-primary.btn-sm.primary-action').click()

cy.wait(10000)

//Assertion to confirm submit

cy.visit('http://100.64.34.39:8005/app/lead')

cy.wait(10000)






})
})
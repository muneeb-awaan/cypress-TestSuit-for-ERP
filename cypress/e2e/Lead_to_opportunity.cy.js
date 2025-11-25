describe(' Lead to opportunity flow', () => {
it('Converts Lead into Opportunity', () => {
cy.visit('http://100.64.34.39:8005/login?redirect-to=%2F#login', {
  headers: {
    "Accept-Encoding": "gzip, deflate"
  }
})

//login

cy.get('#login_email').type('administrator');
cy.get('#login_password').type('admin');

cy.get('#page-login > div > main > div.page_content > div > section.for-login > div.login-content.page-card > form > div > div.page-card-actions > button').click();

//go to leads page
cy.wait(2000)
cy.visit('http://100.64.34.39:8005/app/lead')

cy.wait(9000)

// click specific lead
cy.get('a[href="/app/lead/CRM-LEAD-2025-00018"]').click();

// Click the Create dropdown button
cy.get('#page-Lead > div.page-head.flex > div > div > div.flex.col.page-actions.justify-content-end > div.custom-actions.hidden-xs.hidden-md > div:nth-child(1) > button')
  .should('be.visible')
  .click();

 // click the "Opportunity" option
cy.contains('a', 'Opportunity')
  .should('be.visible')
  .click();

  //uncheck 

  cy.wait(1000)

cy.get('.modal-content')
  .find('.checkbox input[type="checkbox"]')
  .should('be.visible')
  .uncheck({ force: true });

  cy.wait(500);


// Re-query after the modal is updated
cy.get('.modal-content')
  .find('.checkbox input[type="checkbox"]')
  .should('not.be.checked');


  // click create

  cy.get('.modal-content')                     
  .find('.standard-actions')                 
  .contains('button', /^Create$/)            
  .should('be.visible')                      
  .click({ force: true });  
  
  cy.wait(4000)

// Assert that we are on new opportunity page
cy.get('h1, h2, h3, h4', { timeout: 4000 }) 
  .contains(/^New Opportunity$/)        
  .should('be.visible');                              

cy.get('#opportunity-__details > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > div > div > input').clear().type('Sales') 

cy.get('#opportunity-__details > div:nth-child(1) > div > div:nth-child(3) > form > div:nth-child(1) > div > div.control-input-wrapper > div.control-input > div > div > input').clear().type('Qualification') 

cy.get('#opportunity-__details > div:nth-child(1) > div > div:nth-child(3) > form > div:nth-child(3) > div > div.control-input-wrapper > div.control-input > input').clear().type('90') 

cy.get('#opportunity-__details > div:nth-child(1) > div > div:nth-child(3) > form > div:nth-child(2) > div > div.control-input-wrapper > div.control-input > input').click() 

cy.get('.datepicker--cell-day[data-date="28"][data-month="9"][data-year="2025"]')
  .filter(':visible')
  .first()
  .click({ force: true });

cy.get('#opportunity-__details > div:nth-child(1) > div > div:nth-child(1) > form > div:nth-child(3) > div > div.control-input-wrapper > div.control-input > div > div > input').clear().type('Lead') 


cy.get('select[data-fieldname="status"]:visible')
  .first()
  .select('Open', { force: true });

  cy.get('select:visible')
  .filter('[data-fieldname="no_of_employees"]')
  .first()
  .select('11-50', { force: true });

  cy.get('input:visible')
  .filter('[data-fieldname="industry"]')
  .first()
  .clear() 
  .type('Computer', { force: true });


  cy.get('input[data-fieldname="city"]:visible')
  .first()
  .clear()
  .type('Islamabad', { force: true });

  cy.get('input[data-fieldname="market_segment"]:visible')
  .first()
  .clear()
  .type('Upper Income', { force: true });

  cy.get('input[data-fieldname="state"]:visible')
  .first()
  .clear()
  .type('Punjab', { force: true });

  cy.get('input[data-fieldname="territory"]:visible')
  .first()
  .clear()
  .type('Pakistan', { force: true });

  cy.get('input[data-fieldname="currency"]:visible')
  .first()
  .clear()
  .type('PKR', { force: true });

  cy.get('input[data-fieldname="opportunity_amount"]:visible')
  .first()
  .clear()
  .type('500000')

  //Save Form

  cy.scrollTo('top')
cy.get('button.btn.btn-primary.btn-sm.primary-action:visible')
  .first()
  .click({ force: true })

  










});
});

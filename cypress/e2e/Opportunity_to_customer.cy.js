describe('Lead to Opportunity Flow', () => {
  it('Converts Lead into Opportunity', () => {
    cy.visit('http://100.64.34.39:8005/login?redirect-to=%2F#login', {
      headers: {
        "Accept-Encoding": "gzip, deflate"
      }
    })

    cy.wait(5000)


    cy.get('#login_email').type('administrator')
cy.get('#login_password').type('admin')

cy.get('#page-login > div > main > div.page_content > div > section.for-login > div.login-content.page-card > form > div > div.page-card-actions > button').click()


cy.wait(2000)
cy.visit('http://100.64.34.39:8005/app/opportunity/CRM-OPP-2025-00023')

cy.wait(3000)
cy.get('.custom-actions button[data-toggle="dropdown"]', { timeout: 9000 })
  .should('be.visible')
  .contains('Create')
  .click({ force: true })


  cy.get('[data-label="Customer"]:visible')
  .click()

  cy.wait(5000)

cy.get('input[data-fieldname="customer_name"]:visible')
  .clear()
  .type('TechTower')

 cy.get('select[data-fieldname="customer_type"]:visible')
  .select('Company')

  cy.get('input[data-fieldname="customer_group"]:visible')
  .clear()
  .type('Commercial')

  cy.get('input[data-fieldname="account_manager"]:visible')
  .clear()
  .type('guest')

cy.get('input[data-fieldname="default_currency"]:visible')
  .clear()
  .type('PKR')

cy.get('input[data-fieldname="default_price_list"]:visible')
  .clear()
  .type('1000')

  cy.get('input[data-fieldname="default_bank_account"]:visible')
  .clear()
  .type('Habib Metro Bank - Habib Metro Bank')

//   cy.get('#customer-__details > div:nth-child(4) > div.section-head.collapsible.collapsed')
//   .click()

//   cy.get('input[data-fieldname="is_internal_customer"]')
//   .check()


// cy.get('input[data-fieldname="represents_company"]')
//   .should('be.visible')
//   .clear()
//   .type('Inara Technologies{enter}')


// cy.get('div[data-fieldname="companies"] .grid-row-check')
//   .should('be.visible')   
//   .check()

  // scope to the whole 5th collapsible block
cy.get('#customer-__details > div:nth-child(5)').within(() => {
  // click header if it is collapsed
  cy.get('div.section-head')
    .then($h => {
      if ($h.hasClass('collapsed')) {
        cy.wrap($h).scrollIntoView().click();
      }
    })

  // wait for the visible body inside this same block
  cy.get('.section-body')
    .should('be.visible');

  // now find the visible market_segment input inside this block and type
  cy.get('input[data-fieldname="market_segment"]')
    .should('be.visible')
    .clear()
    .type('Upper Income')
})



// scope to the whole 5th collapsible block to avoid hidden duplicates
cy.get('#customer-__details > div:nth-child(5)').within(() => {
  // 1) Expand the section if collapsed
  cy.get('div.section-head').then($h => {
    if ($h.hasClass('collapsed')) {
      cy.wrap($h).scrollIntoView().click();
    }
  })

  // 2) Wait for the section body to be visible
  cy.get('.section-body', { timeout: 1000 }).should('be.visible');

  // Helper: get visible input for a data-fieldname (avoids hidden duplicates)
  const visibleInput = (field) =>
    cy.get(`input[data-fieldname="${field}"]`, { timeout: 10000 }).filter(':visible').first()

  
  visibleInput('industry')
    .should('be.visible')
    .clear()
    .type('Computer')

  
  visibleInput('website')
    .should('be.visible')
    .clear()
    .type('www.yahoo.com')

  
  visibleInput('language')
    .should('be.visible')
    .clear()
    .type('English{enter}')

  
  cy.get('textarea[data-fieldname="customer_details"]', { timeout: 10000 })
    .filter(':visible')
    .first()
    .should('be.visible')
    .clear()
    .type(`This customer represents a high-value enterprise client.
They are looking for scalable software infrastructure solutions.
The client is based in the technology sector with strong growth potential.
Our objective is to establish a long-term partnership.
Customer has shown interest in cloud integration and automation services.`);
})

// in your test
cy.clickSave()

// or with options:
cy.clickSave({ rootSelector: '#page-Customer', timeout: 15000 })


cy.get('[data-fieldname="contact_and_address_tab"]', { timeout: 3000 }).click()


cy.get('#customer-contact_and_address_tab button').eq(0).click()


// Fill out Contact & Address tab fields

cy.get('input[data-fieldname="email_id"]').filter(':visible').first().clear().type('rosewood@example.com')
cy.get('select[data-fieldname="address_type"]').select('Billing');
cy.get('input[data-fieldname="phone"]').filter(':visible').first().clear().type('038989889')
cy.get('input[data-fieldname="address_line1"]').filter(':visible').first().clear().type('123 Main Street, Islamabad')
cy.get('input[data-fieldname="fax"]').filter(':visible').first().clear().type('051-1234567')
cy.get('input[data-fieldname="address_line2"]').filter(':visible').first().clear().type('Near Centaurus Mall')
cy.get('input[data-fieldname="tax_category"]').filter(':visible').first().clear().type('Danial Tax Category')
cy.get('input[data-fieldname="city"]').filter(':visible').first().clear().type('Islamabad')
cy.get('input[data-fieldname="is_primary_address"]').filter(':visible').first().check()
cy.get('input[data-fieldname="county"]').filter(':visible').first().clear().type('Rawalpindi District')
cy.get('input[data-fieldname="state"]').filter(':visible').first().clear().type('Punjab')
cy.get('input[data-fieldname="country"]').filter(':visible').first().clear().type('Pakistan{enter}')
cy.get('input[data-fieldname="pincode"]').filter(':visible').first().clear().type('44000')

cy.clickSave({ rootSelector: 'body', timeout: 10000 });

cy.get('a[href="#customer-tax_tab"]')
  .should('be.visible')
  .click()

  // fill tax details
cy.get('input[data-fieldname="tax_id"]')
  .filter(':visible')
  .first()
  .clear()
  .type('1122')

cy.get('input[data-fieldname="tax_category"]')
  .filter(':visible')
  .first()
  .clear()
  .type('Danial Tax Category{enter}')

cy.get('input[data-fieldname="tax_withholding_category"]')
  .filter(':visible')
  .first()
  .clear()
  .type('TDS on Rent{enter}')

// click Save using  custom command
cy.clickSave({ rootSelector: 'body', timeout: 10000 })











  });
});













  












  

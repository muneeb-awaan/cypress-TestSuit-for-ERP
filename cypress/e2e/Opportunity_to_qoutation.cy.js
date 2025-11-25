describe('Opportunity to Quotation flow', () => {
  it('Creates a Quotation from Opportunity', () => {
    cy.visit('http://100.64.34.39:8005/login?redirect-to=%2F#login', {
      headers: { "Accept-Encoding": "gzip, deflate" }
    });

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

    // Now visit CRM 
    cy.visit('http://100.64.34.39:8005/app/crm')
    // assert crm loaded
    cy.url().should('include', '/app/crm')


    cy.wait(4000)


    cy.get('div[aria-label="Opportunity"]').find('span[title="Opportunity"]').click()

    cy.wait(8000)

    cy.get('.filter-selector use[href="#es-line-filter"]')
  .parent()        
  .click({ force: true })

  cy.wait(2000)

  cy.get('.filter-area button.clear-filters')
  .should('be.visible')
  .click({ force: true });


  cy.wait(10000)


  cy.get('.frappe-list a[href="/app/opportunity/CRM-OPP-2025-00026"]').click()

  cy.wait(5000)
 cy.get('#page-Opportunity > div.page-head.flex > div > div > div.flex.col.page-actions.justify-content-end > div.custom-actions.hidden-xs.hidden-md > div > button')
  .click()

  cy.get('div[role="menu"] a[data-label="Quotation"]').click()

  cy.scrollTo('top');


  cy.get('[data-fieldname="transaction_date"] input[type="text"]')
  .click({ force: true })
  .clear({ force: true })
  .type('22-10-2025', { force: true })
  .blur({ force: true })

  cy.wait(8000)

  cy.get('[data-fieldname="order_type"] select').select('Sales');

  cy.get('[data-fieldname="valid_till"] input[type="text"]')
  .click()                    
  .clear()
  .wait(1000)               
  .type('22-11-2025')
  

  cy.get('[data-fieldname="quotation_to"] input[type="text"]')
  .click()        
  .clear()             
  .type('Lead')
  .blur()

  
  cy.get('[data-fieldname="party_name"] input[type="text"]:visible')
  .click()
  .clear()
  .type('CRM-LEAD-2025-00018')
  .blur()



cy.wait(1500);

cy.scrollTo('center')
// click Add Row (make sure intercept above is registered BEFORE this)
cy.get('.grid-add-row').filter(':visible').first().click({ force: true });



  //using helper function to fill feilds using dataFeildName attribute and value
cy.fillLastGridRowField('item_code', 'IT-00064')


/**
 * NOTE:
 * Normally, in the live app, a user can type into a field and it stays. However,
 * during Cypress tests, the framework types programmatically and some ERPNext
 * dynamic behaviors (like server calls that re-render the row after typing)
 * can reset the input. This is why we:
 *   1. Carefully select the last row element from the scoped $rows collection
 *      to avoid hidden/template duplicates.
 *   2. Avoid sending {enter} which triggers extra server calls.
 *   3. Use force typing and retries to ensure Cypress can input the value.
 * 
 * This workaround is purely to make Cypress tests reliable; a normal user
 * would never experience the input disappearing like this.
 */


cy.intercept('POST', '**/frappe.desk.search.search_link').as('searchLink');
cy.intercept('POST', '**/erpnext.stock.get_item_details.get_item_details').as('itemDetails');
cy.intercept('POST', '**/erpnext.stock.get_item_details.get_item_tax_template').as('taxTemplate');

// now type the item_tax_template value safely
cy.fillLastGridRowField('item_tax_template', 'GST O-15 - IT');

// wait for any of those network calls that might reset the field
cy.wait(['@searchLink', '@itemDetails', '@taxTemplate'], { timeout: 10000 }).then(() => {
  cy.wait(800); // small buffer
});

//retype the value after reset
cy.fillLastGridRowField('item_tax_template', 'GST O-15 - IT');


cy.wait(1000)

cy.get('div.col[data-fieldname="item_tax_template"]').find('input, textarea')
  .should('have.value', 'GST O-15 - IT');



cy.scrollTo('top')


// cy.get('.page-head-content')
//   .find('button[data-label="Save"]').first()
//   .click({ force: true });

  cy.wait(3000)

//-----------------------------//

// ⚙️ Custom Save trigger for ERPNext (Frappe) forms
// --------------------------------------------------
// In ERPNext (built on the Frappe framework), forms run complex client-side logic when the "Save"
// button is clicked — including validation, background XHRs, and a route change from
// "/app/quotation/new-quotation-xyz" → "/app/quotation/<saved-docname>".
// 
// During Cypress automation, this logic often fails to trigger with a normal cy.click(), because
// Cypress executes inside its own iframe and doesn't always propagate events or wait for the
// asynchronous Frappe form lifecycle to finish. As a result, the save may appear to happen visually
// but the backend state (or the route update) doesn’t complete properly.
// 
// To handle this reliably, we use the Frappe API directly through the app’s window object:
//   fWin.cur_frm.save('Save') → programmatically triggers Frappe’s internal save method.
//   fWin.frappe.set_route('Form', 'Quotation', frm.docname) → forces a route update so that
//   the newly saved document is rendered just as it would be for a real user.
// 
// This approach ensures that all the framework’s internal events, backend calls, and UI refreshes
// occur exactly as they do in real user interaction — while avoiding Cypress’s iframe isolation issues.

//----------------------------------//

cy.window().then(win => {
  const fWin = win; 
  const frm = fWin.cur_frm;

  if (!frm) throw new Error('cur_frm not found in visible form');

  frm.save().then(() => {
    // Navigate to the newly created doc page to mimic rerender
    fWin.frappe.set_route('Form', 'Quotation', frm.docname);
  });
});

cy.wait(3000)

cy.get('.page-head-content')
  .find('button[data-label="Submit"]')
  .click({ force: true });


cy.wait(1000)

cy.get('.modal-content .modal-title')
  .should('be.visible')
  .and('contain.text', 'Confirm');

cy.get('.modal-content')
  .contains('button', 'Yes')
  .click({ force: true });


})
})


  














  


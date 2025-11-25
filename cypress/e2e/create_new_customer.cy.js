describe('New Customer ', () => {
it('Creates a new customer', () => {
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



cy.get('a[title="Selling"]').click()

cy.wait(2000)

cy.get('a[title="Customer"]',{timeout:5000}).scrollIntoView().click()

cy.url().should('eq', 'http://100.64.34.39:8005/app/customer',{timeout:6000})

cy.get('button[data-label="Add Customer"]', { timeout: 10000 })
  .should('be.visible')
  .click();
  

cy.get('.modal-dialog').within(() => {
  cy.contains('button', /Edit\s*Full\s*Form/i).click({ force: true });
});

cy.wait(1000)

cy.get('button[data-dismiss="modal"]', { timeout: 5000 }).click({ force: true });

cy.wait(4000)

// generate random 2-digit number
const randomNum = Math.floor(10 + Math.random() * 90);

const customerName = `TestCustomer${randomNum}`;
// wait until the form is fully ready
cy.window().its('cur_frm').should('exist');

cy.window().then(win => {
  const frm = win.cur_frm;
  if (frm) {
    // Set the Customer Name
    frm.set_value('customer_name', customerName);
    frm.refresh_field('customer_name'); // sync input
  }
});

// Assert ERPNext internal doc
cy.window().then(win => {
  expect(win.cur_frm.doc.customer_name).to.eq(customerName);
});


// // type unique customer name
// cy.get('.form-section.card-section.visible-section [data-fieldname="customer_name"]', { timeout: 10000 }).first()
//   .should('be.visible')
//   .type(customerName);



cy.get('select[data-fieldname="customer_type"]')
  .should('be.visible')
  .first()
  .select('Company')

  cy.get('[data-fieldname="customer_group"]')
  .filter(':visible')       // only keep visible elements
  .first()
  .type('Commercial');



cy.get('[data-fieldname="territory"]')
  .filter(':visible')
  .first()
  .type('Pakistan');


cy.get('[data-fieldname="lead_name"]')
  .filter(':visible')
  .first()
  .type('CRM-LEAD-2025-00016');



 cy.get('[data-fieldname="default_currency"] input')
  .filter(':visible')
  .first()
  .click()
  .type('PKR{enter}');

  cy.get('[data-fieldname="default_price_list"]')
  .filter(':visible')
  .first()
  .type('Standard Selling{enter}');

  cy.get('a[data-fieldname="contact_and_address_tab"]')
  .filter(':visible')
  .first()
  .click({ force: true })

  cy.get('input[data-fieldname="customer_primary_address"]')
  .filter(':visible')
  .first()
  .click({ force: true })

  cy.wait(1000)

  cy.get('div[role="option"] p[title="Create a new Address"]')
  .filter(':visible')
  .first()
  .click({ force: true });

  cy.wait(3000)

  // generate 2-digit random number
const rand2 = Math.floor(10 + Math.random() * 90);

// Address Title
cy.get('[data-fieldname="address_title"]')
  .filter(':visible')
  .first()
  .type(customerName);


// Email ID
cy.get('[data-fieldname="email_id"]')
  .filter(':visible')
  .first()
  .type(`TestEmail${rand2}@gmail.com`)


cy.get('select[data-fieldname="address_type"]')
  .filter(':visible')
  .first()
  .select('Billing')

// Address Line 1
cy.get('[data-fieldname="address_line1"]')
  .filter(':visible')
  .first()
  .type(`TestAddress${rand2}`)


cy.get('[data-fieldname="city"]')
  .filter(':visible')
  .first()
  .type('Islamabad')

  cy.scrollTo('top')

  
// Before clicking Save, re-set the Customer Name
cy.window().then(win => {
  if (win.cur_frm) {
    win.cur_frm.set_value('customer_name', customerName);
    win.cur_frm.refresh_field('customer_name'); 
  }
});

cy.wait(1000)


  cy.get('button[data-label="Save"]').first().click({ force: true });







})
})
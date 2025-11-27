describe('New Customer', () => {
  it('Creates a new customer', () => {
    const randomNum = Math.floor(10 + Math.random() * 90);
    const customerName = `TestCustomer${randomNum}`;

    // Visit login page
    cy.visit('http://100.64.34.39:8005/login?redirect-to=%2F#login', {
      headers: { "Accept-Encoding": "gzip, deflate" }
    });

    // Clear fields and login
    cy.get('#login_email').clear().type('administrator');
    cy.get('#login_password').clear().type('admin');

    cy.intercept('POST', '/login').as('loginRequest');
    cy.get('#page-login button[type="submit"]').first().click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('not.include', '/login');
    cy.url().should('eq', 'http://100.64.34.39:8005/');

    // Navigate to Customer
    cy.visit('http://100.64.34.39:8005/app');
    cy.wait(5000);
    cy.get('a[title="Selling"]').click();
    cy.wait(2000);
    cy.get('a[title="Customer"]', { timeout: 5000 }).scrollIntoView().click();
    cy.url().should('eq', 'http://100.64.34.39:8005/app/customer', { timeout: 6000 });

    // Add Customer
    cy.get('button[data-label="Add Customer"]', { timeout: 10000 }).should('be.visible').click();
    cy.intercept('POST', '**/api/resource/Customer**').as('saveDiag');

    // Open Full Form
    cy.get('.modal-dialog').within(() => {
      cy.contains('button', /Edit\s*Full\s*Form/i).click({ force: true });
    });

    cy.wait(1000);
    cy.get('button[data-dismiss="modal"]', { timeout: 5000 }).click({ force: true });
    cy.wait(4000);

    // Fill basic customer details


    // Wait until the input is visible
cy.get('[data-fieldname="customer_name"] input')
  .filter(':visible')
  .first()
  .type(customerName)      
  .should('have.value', customerName); 

    cy.get('select[data-fieldname="customer_type"]').should('be.visible').first().select('Company');
    cy.get('[data-fieldname="customer_group"]').filter(':visible').first().type('Commercial');
    cy.get('[data-fieldname="territory"]').filter(':visible').first().type('Pakistan');
    cy.get('[data-fieldname="lead_name"]').filter(':visible').first().type('CRM-LEAD-2025-00016');
    cy.get('[data-fieldname="default_currency"] input').filter(':visible').first().click().type('PKR{enter}');
    cy.get('[data-fieldname="default_price_list"]').filter(':visible').first().type('Standard Selling{enter}');

    // Fill Address tab
    cy.get('a[data-fieldname="contact_and_address_tab"]').filter(':visible').first().click({ force: true });
    cy.get('input[data-fieldname="customer_primary_address"]').filter(':visible').first().click({ force: true });
    cy.wait(1000);
    cy.get('div[role="option"] p[title="Create a new Address"]').filter(':visible').first().click({ force: true });
    cy.wait(3000);

    const rand2 = Math.floor(10 + Math.random() * 90);

    cy.get('[data-fieldname="address_title"]').filter(':visible').first().type(customerName);
    cy.get('[data-fieldname="email_id"]').filter(':visible').first().type(`TestEmail${rand2}@gmail.com`);
    cy.get('select[data-fieldname="address_type"]').filter(':visible').first().select('Billing');
    cy.get('[data-fieldname="address_line1"]').filter(':visible').first().type(`TestAddress${rand2}`);
    cy.get('[data-fieldname="city"]').filter(':visible').first().type('Islamabad');
    cy.scrollTo('top');


    // Save Customer
    cy.get('button[data-label="Save"]').first().click({ force: true });

   
  });
});

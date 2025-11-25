describe('Sales Order from Qoutation', () => {
  it('Creates a Sales Order from Qoutation', () => {
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

    // Now visit qoutation page
    cy.visit('http://100.64.34.39:8005/app/quotation')

    cy.wait(5000)

    // assert crm loaded
    cy.url().should('include', '/app/quotation')


    cy.wait(7000)

   cy.get('.filter-section')
  .find('button[title="Clear all filters"]')
  .first()
  .click({ force: true });


    cy.get('.result').wait(1000)
  .find('a[href="/app/quotation/SAL-QTN-2025-00021"]')
  .click()

  cy.url().should('include', '/app/quotation/SAL-QTN-2025-00021')

  cy.wait(5000)



// Wait for quotation items to load 
cy.get('.data-row, .grid-row, tr[data-row-index]', { timeout: 10000 })
  .should('have.length.gte', 1);

// Click Create -> Sales Order
cy.get('.page-head-content').contains('button', 'Create').should('be.visible').click();
cy.wait(300); 

// Click Sales Order (prefer visible; fallback to force only this click)
cy.get('body').then(() => {
  const visible = Cypress.$('a.dropdown-item')
    .filter((i, el) => Cypress.$(el).text().trim().includes('Sales Order') && (el.offsetWidth || el.offsetHeight));
  if (visible.length) {
    cy.wrap(visible.eq(0)).click();
  } else {
    cy.contains('a.dropdown-item', 'Sales Order').scrollIntoView().click({ force: true })
  }
});

// Final assertion: landed on Sales Order page
cy.url({ timeout: 10000 }).should('include', '/sales-order');

cy.wait(7000)

cy.scrollTo('top');

 


cy.typeDateField('transaction_date', '28-10-2025');



  cy.scrollTo('top');

  cy.get('body').type('{esc}');


  cy.scrollTo('top');



cy.typeDateField('delivery_date', '04-06-2026');


// Close calendar 
cy.get('body').type('{esc}');

cy.scrollTo('top');



cy.get('.control-input [data-fieldname="po_no"]')
  .click({ force: true }) 
  .clear()
  .type('12345', { delay: 100 })

  cy.scrollTo('top');
  
cy.get('.control-input [data-fieldname="customer"]')
  .click({ force: true })
  .clear()
  .type('TechTower - 9', { delay: 100 })
  .type('{enter}')

  cy.scrollTo('top');

  cy.get('select[data-fieldname="order_type"]')
  .first()
  .select('Sales', { force: true });







// Close calendar if opened
cy.get('body').type('{esc}');

cy.scrollTo('top');

// ERPNext triggers this API call after item details change.
// It can reset date fields (like po_date) while it updates pricing and dependencies.
// To avoid race conditions, wait for this API to finish before typing the date

// alias the network call that clears the field
cy.intercept('POST', '/api/method/erpnext.stock.get_item_details.apply_price_list').as('applyPrice');

// wait for the XHR that might reset fields
cy.wait('@applyPrice', { timeout: 15000 });

// now use the helper to set the po_date
cy.typeDateField('po_date', '14-06-2026');

// final assert
cy.get('.control-input [data-fieldname="po_date"]', { timeout: 6000 })
  .should('have.value', '14-06-2026');





const headerSelector = '.section-head.collapsible';

cy.get(headerSelector)
  .filter((_, el) => el.innerText.replace(/\s+/g,' ').trim() === 'Accounting Dimensions')
  .first()
  .as('acctHead');

cy.get('@acctHead').then(function tryClick() {
  cy.get('@acctHead').then($h => {
    if ($h.hasClass('collapsed')) {
      cy.wrap($h).click({ force: true });
      // give the page a moment to react, then check again
      cy.wait(300);
      return tryClick();
    }
  });
});

// final assert
cy.get('@acctHead').should('not.have.class', 'collapsed');

// cy.scrollTo('top')

const target = cy.get('.control-input [data-fieldname="project"]').first();

target.then($el => {
  // Scroll the actual DOM element into center view
  $el[0].scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
});

cy.wait(150); // let layout settle after scrolling

// Perform double-click sequence to make sure dropdown opens
target.click({ force: true });
cy.wait(200);
target.click({ force: true });

cy.wait(2000)

cy.get('ul[role="listbox"] div[role="option"] p', { timeout: 1000 })
  .should('contain.text', 'Create a new Project')
  .contains('Create a new Project')
  .click({ force: true })

  cy.wait(2000)

  // assert that modal appears with correct title
cy.get('.modal-content', { timeout: 2000 })   
  .should('be.visible')                        
  .within(() => {
    cy.get('h4.modal-title')                   
      .should('be.visible')
      .and('have.text', 'New Project');        
  });


  cy.get('.modal-content [data-fieldname="project_name"] input, .modal-content [data-fieldname="project_name"] textarea', { timeout: 1000 })
  .first()
  .click({ force: true })
  .clear({ force: true })
  .type('Test Project1', { delay: 100 })
  .should('have.value', 'Test Project1');

cy.get('.modal-footer button')
  .contains('Edit Full Form')
  .should('be.visible')
  .click({ force: true });

  cy.typeDateField('expected_start_date', '10-11-2025')
  cy.typeDateField('expected_end_date', '03-04-2026')

  cy.get('.control-input [data-fieldname="project_type"]')
  .first()
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('External {enter}', { delay: 100 })
  .should('have.value', 'External');

  cy.get('select[data-fieldname="status"]')
  .should('exist')
  .select('Open', { force: true })
  .should('have.value', 'Open');

  cy.get('select[data-fieldname="priority"]')
  .should('exist')
  .select('Medium', { force: true })
  .should('have.value', 'Medium');

  cy.get('.control-input [data-fieldname="department"]')
  .first()
  .scrollIntoView()
  .click({ force: true })
  .clear({ force: true })
  .type('Software Development - IT{enter}', { delay: 100 })
  .should('have.value', 'Software Development - IT');
cy.scrollTo('top')


cy.wait(500)

 
cy.get('.page-head').find('button[data-label="Save"]').then($buttons => {
  // try to prefer a visible button
  const $visible = $buttons.filter(':visible').first();
  const $btn = $visible.length ? $visible : $buttons.first();

  // if not visible, make it temporarily visible (test-only)
  if (!$btn.is(':visible')) {
    $btn.css('display', 'inline-block');
  }

  cy.wrap($btn).click({ force: true });
});










  })
})


























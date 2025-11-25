describe('New Project ', () => {
it('Adds a new project', () => {
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

cy.url().should('eq', 'http://100.64.34.39:8005/app/lending')


cy.get('#navbar-search').click().type('project');

// wait for dropdown to appear
cy.get('#awesomplete_list_1', { timeout: 10000 }).should('be.visible');

// click "New Project" using a real user click
cy.get('#awesomplete_list_1 li a').filter((index, el) => {
  return el.innerText.trim() === 'New Project';
}).realClick();



cy.wait(5000)

// assert modal title
cy.get('.modal-dialog').within(() => {
  cy.get('.modal-title').should('have.text', 'New Project');
});

// click "Edit Full Form" if modal exists
cy.get('body').then($body => {
  if ($body.find('.modal-dialog').length) {
    cy.get('.modal-dialog').within(() => {
      cy.contains('button', 'Edit Full Form', { matchCase: true }).click({ force: true });
    });
  }
});

// wait a short moment for modal to potentially auto-close
cy.wait(200);

// -----------------------------------------------------
// Manually: when a user clicks "Edit Full Form", the modal
// automatically closes and the full form renders in the background.
//
// In Cypress: due to SPA async behavior and fast execution,
// the modal sometimes does not close auto , so i handled taht condition
//
// Solution: we use a conditional approach:
// click edit full form After that, check if the modal still exists; if so close it
//    using the button with data-dismiss="modal".
// Finally, assert that the modal is no longer visible.
// This ensures the test is deterministic regardless of whether
// the modal auto-closes or remains briefly in the DOM.
// -----------------------------------------------------------


// now try to close modal only if it still exists
cy.get('body').then($body => {
  if ($body.find('.modal-dialog').length) {
    cy.get('.modal-dialog').within(() => {
      cy.get('button[data-dismiss="modal"]', { timeout: 5000 }).click({ force: true });
    });
  }
});
// Assert modal is not visible anymore
cy.get('.modal-dialog', { timeout: 10000 }).should('not.be.visible');

// generate random 3-digit number
const randomNum = Math.floor(100 + Math.random() * 900); // 100-999

// type unique project name
cy.get('[data-fieldname="project_name"]').first().type(`TestProject${randomNum}`);

cy.get('select[data-fieldname="status"]').select('Open');

cy.get('[data-fieldname="project_type"]').first().type('External');

cy.get('select[data-fieldname="priority"]').select('High');

cy.get('[data-fieldname="department"]')
  .first()
  .type('Software Development - IT');

cy.typeDateField('expected_start_date', '17-11-2025');
cy.typeDateField('expected_end_date', '13-05-2026');

cy.scrollTo('top')

cy.get('button[data-label="Save"]').click({ force: true });


})
})
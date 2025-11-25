// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// cypress/support/commands.js







Cypress.Commands.add('clickSave', (opts = {}) => {
  const rootSelector = opts.rootSelector || '#page-Customer';
  const timeout = opts.timeout || 10000;

  // helper: close or hide any modals / overlays
  const clearBlockingOverlays = (stage = 'before') => {
    const modals = Cypress.$('.modal.fade.show, .modal.show, .overlay, .loading-mask, .modal-backdrop');
    if (!modals.length) return false;

    cy.log(`Closing modal(s) ${stage} Save...`);
    const closeBtn = modals.find('button.close, button[data-dismiss="modal"], .btn-close, .modal .close, .modal .btn-secondary');
    if (closeBtn.length) {
      cy.wrap(closeBtn.first()).click({ force: true });
    } else {
      // if no close button found, hide all modals forcibly
      modals.css('display', 'none');
      Cypress.$('.modal-backdrop').css('display', 'none');
    }
    return true;
  };

  // step 1: clear modals *before* clicking Save
  cy.get('body').then(() => {
    const hadOverlay = clearBlockingOverlays('before');

    // step 2: find and click Save button
    cy.get(rootSelector, { timeout }).then($root => {
      const candidates = $root.find('button.primary-action, button.btn-primary, button[data-label="Save"]');
      const visible = candidates.filter(':visible');
      const clickOptions = hadOverlay ? { force: true } : undefined;

      if (visible.length) {
        cy.wrap(visible.first()).scrollIntoView().click(clickOptions);
      } else {
        const byText = $root.find('button, a, input').filter((i, el) =>
          (el.innerText || '').trim().toLowerCase() === 'save'
        );

        if (byText.length) {
          cy.wrap(byText.first()).scrollIntoView().click(clickOptions);
        } else if (candidates.length) {
          cy.wrap(candidates.first()).scrollIntoView().click(clickOptions || {}).catch(() => {
            cy.wrap(candidates.first()).click({ force: true });
          });
        } else {
          cy.contains('button, a, input', /^Save$/i, { timeout: 5000 })
            .then($el => {
              if ($el && $el.length)
                cy.wrap($el.first()).scrollIntoView().click(clickOptions || { force: true });
              else
                throw new Error(`clickSave: Save button not found inside ${rootSelector}`);
            });
        }
      }
    });

    // step 3: after Save click — close any modal that pops up
    cy.wait(1000); // short wait to allow modal animation
    cy.get('body').then(() => {
      const closed = clearBlockingOverlays('after');
      if (closed) cy.log('Post-Save modal closed.');
    });
  });
});





//helper to handle date feilds
Cypress.Commands.add('typeDateField', (fieldName, date) => {
  const sel = `.control-input [data-fieldname="${fieldName}"]`;
  const finalDate = date;

  cy.get(sel)
    .first()
    .scrollIntoView()
    .click({ force: true })
    .clear({ force: true })
    .type(`{selectall}${finalDate}`, { force: true })
    .then($el => {
      if ($el.val() === finalDate) {
        cy.log(`${fieldName}: typed ok`);
        return;
      }
      cy.log(`${fieldName}: fallback invoke('val')`);
      cy.wrap($el)
        .invoke('val', finalDate)
        .invoke('attr', 'data-value', finalDate)
        .trigger('input', { force: true })
        .trigger('change', { force: true });
    })
    .then(() => {
      cy.get(sel, { timeout: 6000 }).should($final => {
        expect($final.val(), `${fieldName} final value`).to.equal(finalDate);
      });
    });
});



// helper to handle dynamic rows inside (currency and price list)section on new qoutation page for (Opportunity to qoutation) flow


// Cypress.Commands.add('fillLastGridRowField', (fieldName, value) => {
//   cy.get('.form-grid-container:visible').first().find('.rows').then($rows => {
//     const idxs = $rows.find('[data-idx]').map((i, el) => Number(el.getAttribute('data-idx'))).get();
//     if (!idxs.length) throw new Error('No rows/data-idx found');
//     const lastIdx = Math.max(...idxs);
//     const rowSel = `.grid-row[data-idx="${lastIdx}"]`;

//     cy.get(rowSel, { timeout: 10000 }).within(() => {
//       const cellSel = `div.col[data-fieldname="${fieldName}"]`;
//       cy.get(cellSel, { timeout: 5000 }).then($cell => {
//         const $input = $cell.find('input, textarea').first();
//         if ($input && $input.length) {
//           cy.wrap($input).clear({ force: true }).type(value + '{enter}', { force: true });
//         } else {
//           cy.wrap($cell).find('.static-area').first().click({ force: true });
//           cy.wrap($cell).find('.field-area input, .field-area textarea', { timeout: 5000 })
//             .should('exist')
//             .then($activatedInput => {
//               if (Cypress.dom.isVisible($activatedInput)) {
//                 cy.wrap($activatedInput).clear().type(value + '{enter}');
//               } else {
//                 cy.wrap($activatedInput).clear({ force: true }).type(value + '{enter}', { force: true });
//               }
//             });
//         }
//       });
//     });
//   });
// });



Cypress.Commands.add('fillLastGridRowField', (fieldName, value) => {
  cy.get('.form-grid-container:visible').first().find('.rows').then($rows => {
    const idxs = $rows.find('[data-idx]').map((i, el) => Number(el.getAttribute('data-idx'))).get();
    if (!idxs.length) throw new Error('No rows/data-idx found');
    const lastIdx = Math.max(...idxs);

    // Select the actual row element from the already-scoped $rows to ensure a single element
    const $targetRow = $rows.find(`[data-idx="${lastIdx}"]`).first();
    if (!$targetRow || !$targetRow.length) throw new Error(`Row with data-idx ${lastIdx} not found`);

    cy.wrap($targetRow).within(() => {
      const cellSel = `div.col[data-fieldname="${fieldName}"]`;
      cy.get(cellSel, { timeout: 5000 }).then($cell => {
        const $input = $cell.find('input, textarea').first();
        if ($input && $input.length) {
          // avoid sending {enter} — Enter often triggers server calls that re-render the row
          cy.wrap($input).clear({ force: true }).type(String(value), { force: true });
        } else {
          // activate static cell then type into the revealed control
          cy.wrap($cell).find('.static-area').first().click({ force: true });
          cy.wrap($cell).find('.field-area input, .field-area textarea', { timeout: 5000 })
            .should('exist')
            .then($activatedInput => {
              if (Cypress.dom.isVisible($activatedInput)) {
                cy.wrap($activatedInput).clear().type(String(value));
              } else {
                cy.wrap($activatedInput).clear({ force: true }).type(String(value), { force: true });
              }
            });
        }
      });
    });
  });
});



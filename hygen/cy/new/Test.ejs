---
to: cypress/e2e/<%= name %>/<%= name %>.cy.js
---
import <%= name %>Collection from '../../fixtures/<%= name %>/getCollection.json';
import new<%= Name %> from '../../fixtures/<%= name %>/post.json';
import <%= name %>Item from '../../fixtures/<%= name %>s/getItem.json';
import edit<%= Name %> from '../../fixtures/<%= name %>s/put.json';

describe('in <%= Name %>', () => {
  beforeEach(() => {
    cy.prepareGenericPactInterceptors('<%= name %>');
    cy.before();

    cy
      .contains('<%= Name %>')
      .click();

    cy
      .get('h3')
      .should('contain', 'List of <%= Name %>');

    cy
      .get('table')
      .should('contain', <%= name %>Collection.body[0].<%= name %>);
  });

  ///////////////////////
  // POST
  ///////////////////////
  it('add <%= Name %>', () => {
    cy.usePactIntercept(
      {
        method: 'POST',
        url: '**/isbc/api/<%= name %>s*',
        response: new<%= Name %>.response,
        matchingRules: new<%= Name %>.matchingRules,
      },
      'create<%= Name %>'
    );

    cy
      .get('[aria-label=Add]')
      .click();

    cy.fillTheForm(
      new<%= Name %>.request
    );

    cy
      .get('h3')
      .should('contain', 'List of <%= Name %>');

    cy
      .usePactWait(['create<%= Name %>'])
      .its('response.statusCode')
      .should('eq', 201);
  });

  ///////////////////////////////
  // PUT
  ///////////////////////////////
  it('edit a <%= Name %>', () => {

    cy.usePactIntercept({
      method: 'GET',
      url: '**/isbc/api/<%= name %>s/1',
      response: {...<%= name %>Item},
    }).as('get<%= Name %>-1');

    cy.usePactIntercept(
      {
        method: 'PUT',
        url: `**/isbc/api/<%= name %>s/${edit<%= Name %>.response.body.id}`,
        response: edit<%= Name %>.response,
      },
      'edit<%= Name %>'
    );

    cy
      .get('svg[data-testid="EditIcon"]')
      .first()
      .click();

    cy.fillTheForm(
      edit<%= Name %>.request
    );

    cy.contains('List of <%= Name %>s');

    cy.usePactWait(['get<%= Name %>s'])
      .its('response.statusCode')
      .should('eq', 200);
  });

  ///////////////////////
  // DELETE
  ///////////////////////
  it('delete <%= Name %>', () => {
    cy.intercept(
      'DELETE',
      '**/isbc/api/<%= name %>s/*',
      {
        statusCode: 204,
      }
    ).as('delete<%= Name %>');

    cy
      .contains('<%= Name %>')
      .click();

    cy
      .get('td > a > svg[data-testid="DeleteIcon"]')
      .first()
      .click();

    cy.contains('Remove element');
    cy
      .get('div[role=dialog] button')
      .filter(':visible')
      .contains('Delete')
      .click();

    cy
      .get('h3')
      .should('contain', 'List of <%= Name %>');

    cy
      .usePactWait(['delete<%= Name %>'])
      .its('response.statusCode')
      .should('eq', 204);
  });
});
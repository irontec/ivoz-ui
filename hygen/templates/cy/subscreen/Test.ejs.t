---
to: cypress/e2e/<%= Name %>/<%= Name %>.cy.js
root: <%= root %>
parent: <%= parent %>
---
import <%= parent %>Collection from '../../fixtures/<%= h.inflection.capitalize(parent) %>/getCollection.json';
import <%= name %>Collection from '../../fixtures/<%= name %>/getCollection.json';
import new<%= Name %> from '../../fixtures/<%= Name %>/post.json';
import <%= name %>Item from '../../fixtures/<%= Name %>/getItem.json';
import edit<%= Name %> from '../../fixtures/<%= Name %>/put.json';

describe('in <%= Name %>', () => {
  beforeEach(() => {
    cy.prepareGenericPactInterceptors('<%= name %>');

    cy.intercept('GET', '**/aps/api/<%= parent %>/1*', {
      ...<%= parent %>Collection,
      body: <%= parent %>Collection.body.find((row) => row.id === 1),
    }).as('getPlatform1');

    cy.before('<%= parent %>');
    cy.get('[aria-label="<%= Name %>"]').first().click();

    cy
      .contains('<%= Name %>')
      .click();

    cy
      .get('h3')
      .should('contain', 'List of <%= Name %>');

    cy
      .get('table')
      .should('contain', <%= name %>Collection.body[0].id);
  });

  ///////////////////////
  // POST
  ///////////////////////
  it('add <%= Name %>', () => {
    cy.usePactIntercept(
      {
        method: 'POST',
        url: '**/<%= root %>/api/<%= h.inflection.pluralize(name) %>*',
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

    cy.usePactIntercept(
      {
        method: 'GET',
        url: '**/<%= root %>/api/<%= h.inflection.pluralize(name) %>/1',
        response: {...<%= name %>Item},
      },
      'get<%= Name %>-1'
    );

    cy.usePactIntercept(
      {
        method: 'PUT',
        url: `**/<%= root %>/api/<%= h.inflection.pluralize(name) %>/${edit<%= Name %>.response.body.id}`,
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

    cy.contains('List of <%= h.inflection.pluralize(Name) %>');

    cy.usePactWait(['edit<%= Name %>'])
      .its('response.statusCode')
      .should('eq', 200);
  });

  ///////////////////////
  // DELETE
  ///////////////////////
  it('delete <%= Name %>', () => {
    cy.intercept(
      'DELETE',
      '**/<%= root %>/api/<%= h.inflection.pluralize(name) %>/*',
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
---
to: cypress/e2e/<%= Name %>/<%= Name %>.cy.js
root: <%= root %>
parent: <%= parent %>
---
import <%= parent %>Collection from '../../fixtures/<%= h.inflection.capitalize(parent) %>/getCollection.json';
import <%= name %>Collection from '../../fixtures/<%= Name %>/getCollection.json';
import new<%= Name %> from '../../fixtures/<%= Name %>/post.json';
import <%= name %>Item from '../../fixtures/<%= Name %>/getItem.json';
import edit<%= Name %> from '../../fixtures/<%= Name %>/put.json';

describe('in <%= Name %>', () => {
  beforeEach(() => {
    cy.prepareGenericPactInterceptors('<%= name %>');

    cy.intercept('GET', '**/aps/api/<%= parent %>/1*', {
      ...<%= parent %>Collection,
      body: <%= parent %>Collection.body.find((row) => row.id === 1),
    }).as('get<%= h.inflection.capitalize(parent) %>-1');

    cy.before('<%= parent %>');
    cy.get('[aria-label="<%= Name %>"]').first().click();

    cy
      .contains('<%= Name %>')
      .click();

    cy
      .get('header')
      .should('contain', '<%= h.inflection.pluralize(Name) %>');

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

    cy.get('header').should('contain', '<%= h.inflection.pluralize(Name) %>');

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

    cy
      .get('header')
      .should('contain', '<%= h.inflection.pluralize(Name) %>');

    cy
      .usePactWait(['edit<%= Name %>'])
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
      .get('td button > svg[data-testid="DeleteIcon"]')
      .first()
      .click();

    cy.contains('Remove element');
    cy
      .get('div.MuiDialog-container button')
      .filter(':visible')
      .contains('Yes, delete it')
      .click();

    cy
      .get('header')
      .should('contain', '<%= h.inflection.pluralize(Name) %>');

    cy
      .usePactWait(['delete<%= Name %>'])
      .its('response.statusCode')
      .should('eq', 204);
  });
});
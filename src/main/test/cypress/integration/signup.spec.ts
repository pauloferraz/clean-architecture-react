import faker from 'faker'
import { simulateValidSignup } from '../support/support-helper'

const baseUrl: string = Cypress.config('baseUrl')

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('signup')
  })
  it('should load correct values', () => {
    cy.getByTestId('submit-button').should('be.disabled')
    cy.getByTestId('name').should('be.empty')
    cy.getByTestId('email').should('be.empty')
    cy.getByTestId('password').should('be.empty')
    cy.getByTestId('passwordConfirmation').should('be.empty')
    cy.getByTestId('status-wrap').should('not.have.descendants')
  })

  it('should present error state if email is invalid', () => {
    cy.getByTestId('name').type(faker.random.words())
    cy.getByTestId('email').type(faker.random.word())
    const pass = faker.random.alphaNumeric(6)
    cy.getByTestId('password').type(pass)
    cy.getByTestId('passwordConfirmation').type(pass)
    cy.getByTestId('status-wrap').should('not.have.descendants')
    cy.getByTestId('submit-button').should('be.disabled')
  })

  it('should present error state if passwordConfirmation is invalid', () => {
    cy.getByTestId('name').type(faker.random.words())
    cy.getByTestId('email').type(faker.internet.email())
    cy.getByTestId('password').type(faker.random.alphaNumeric(6))
    cy.getByTestId('passwordConfirmation').type(faker.random.alphaNumeric(6))
    cy.getByTestId('status-wrap').should('not.have.descendants')
    cy.getByTestId('submit-button').should('be.disabled')
    cy.getByTestId('passwordConfirmationError').should(
      'contain.text',
      'Senhas não conferem'
    )
  })

  it('should present error if email already exists', () => {
    cy.intercept('POST', '/signup', {
      statusCode: 403
    })
    simulateValidSignup()
    cy.getByTestId('status-wrap')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('main-error')
      .should('exist')
      .should('contain.text', 'Esse e-mail já está em uso')
    cy.url().should('eq', `${baseUrl}/signup`)
  })

  it('should present save accessToken if valid credencials', () => {
    cy.intercept('POST', '/signup', {
      statusCode: 200
    })
    simulateValidSignup()
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window =>
      assert.isOk(window.localStorage.getItem('accessToken'))
    )
  })

  it('should present UnexpectedError on default error cases', () => {
    cy.intercept('POST', '/signup', {
      statusCode: 400
    })
    simulateValidSignup()
    cy.getByTestId('status-wrap')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('main-error')
      .should('exist')
      .should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')
    cy.url().should('eq', `${baseUrl}/signup`)
  })
})
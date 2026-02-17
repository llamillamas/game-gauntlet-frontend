describe('Parties Page', () => {
  beforeEach(() => {
    cy.visit('/parties')
  })

  it('displays parties page', () => {
    cy.contains('Parties').should('be.visible')
  })

  it('shows party cards', () => {
    cy.get('a[href^="/parties/"]').should('have.length.greaterThan', 0)
  })

  it('can search parties', () => {
    cy.get('input[type="search"]').type('Warriors')
    cy.contains('Weekend Warriors').should('be.visible')
  })

  it('can filter by status', () => {
    cy.contains('Active').click()
    cy.get('a[href^="/parties/"]').should('exist')
  })

  it('has create party button', () => {
    cy.contains('Create Party').should('be.visible')
  })

  it('opens create party modal', () => {
    cy.contains('Create Party').click()
    cy.contains('Party Name').should('be.visible')
    cy.contains('Select Games').should('be.visible')
  })

  it('closes create party modal', () => {
    cy.contains('Create Party').click()
    cy.get('button').contains('✕').click()
    cy.contains('Party Name').should('not.exist')
  })
})

describe('Party Detail Page', () => {
  beforeEach(() => {
    cy.visit('/parties/p1')
  })

  it('shows party title', () => {
    cy.contains('Weekend Warriors').should('be.visible')
  })

  it('shows bet amount', () => {
    cy.contains('10').should('be.visible') // bet amount
    cy.contains('USDC').should('be.visible')
  })

  it('shows players list', () => {
    cy.contains('Players').should('be.visible')
  })

  it('shows games in party', () => {
    cy.contains('Games in Party').should('be.visible')
  })

  it('shows share button', () => {
    cy.contains('Share').should('be.visible')
  })

  it('shows wallet connect when not connected', () => {
    cy.contains('Connect your wallet').should('be.visible')
  })
})

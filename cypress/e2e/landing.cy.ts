describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays hero section', () => {
    cy.contains('Compete. Bet. Win.').should('be.visible')
    cy.contains('On Solana.').should('be.visible')
  })

  it('shows featured games', () => {
    cy.contains('Featured Games').should('be.visible')
  })

  it('shows platform stats', () => {
    cy.contains('Total Players').should('be.visible')
    cy.contains('Total Volume').should('be.visible')
  })

  it('has working navigation links', () => {
    cy.get('a[href="/games"]').first().click()
    cy.url().should('include', '/games')
  })

  it('Play Now button goes to games', () => {
    cy.contains('Play Now').click()
    cy.url().should('include', '/games')
  })

  it('Create Game button goes to create-game', () => {
    cy.contains('Create Game').first().click()
    cy.url().should('include', '/create-game')
  })
})

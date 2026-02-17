describe('Navigation', () => {
  it('header links work correctly', () => {
    cy.visit('/')

    // Games link
    cy.get('nav a[href="/games"]').click()
    cy.url().should('include', '/games')

    // Parties link
    cy.get('nav a[href="/parties"]').click()
    cy.url().should('include', '/parties')

    // Leaderboard link
    cy.get('nav a[href="/leaderboard"]').click()
    cy.url().should('include', '/leaderboard')

    // Profile link
    cy.get('nav a[href="/profile"]').click()
    cy.url().should('include', '/profile')

    // Home (logo)
    cy.get('a[href="/"]').first().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('footer links are present', () => {
    cy.visit('/')
    cy.get('footer').within(() => {
      cy.contains('Games').should('be.visible')
      cy.contains('Parties').should('be.visible')
      cy.contains('Leaderboard').should('be.visible')
    })
  })

  it('wallet button is visible in header', () => {
    cy.visit('/')
    cy.contains('Connect Wallet').should('be.visible')
  })
})

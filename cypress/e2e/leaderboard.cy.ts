describe('Leaderboard Page', () => {
  beforeEach(() => {
    cy.visit('/leaderboard')
  })

  it('displays leaderboard', () => {
    cy.contains('Leaderboard').should('be.visible')
  })

  it('shows leaderboard entries', () => {
    cy.contains('Crypto Trivia').should('be.visible')
  })

  it('shows earnings columns', () => {
    cy.contains('Earnings').should('be.visible')
  })

  it('can filter by timeframe', () => {
    cy.contains('Monthly').click()
    cy.contains('Monthly').should('have.class', 'bg-gg-primary')
  })

  it('can change sort order', () => {
    cy.get('select').select('Most Played')
    cy.get('table').should('exist')
  })

  it('clicking game name goes to game detail', () => {
    cy.get('table a').first().click()
    cy.url().should('include', '/games/')
  })
})

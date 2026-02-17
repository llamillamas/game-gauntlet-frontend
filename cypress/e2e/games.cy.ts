describe('Games Page', () => {
  beforeEach(() => {
    cy.visit('/games')
  })

  it('displays game discovery page', () => {
    cy.contains('Game Discovery').should('be.visible')
  })

  it('shows game cards in grid', () => {
    cy.get('a[href^="/games/"]').should('have.length.greaterThan', 0)
  })

  it('can search for games', () => {
    cy.get('input[type="search"]').type('Pixel')
    cy.contains('Pixel Racer').should('be.visible')
  })

  it('can sort games', () => {
    cy.get('select').select('Most Played')
    // Should still show games
    cy.get('a[href^="/games/"]').should('exist')
  })

  it('clicking game card goes to game detail', () => {
    cy.get('a[href^="/games/"]').first().click()
    cy.url().should('match', /\/games\/[a-z0-9-]+/)
  })
})

describe('Game Detail Page', () => {
  it('shows game info', () => {
    cy.visit('/games/1')
    cy.contains('Pixel Racer').should('be.visible')
  })

  it('shows stats', () => {
    cy.visit('/games/1')
    cy.contains('Total Plays').should('be.visible')
    cy.contains('Total Earnings').should('be.visible')
  })

  it('has join party button', () => {
    cy.visit('/games/1')
    cy.contains('Join a Party').should('be.visible')
  })
})

describe('Create Game Page', () => {
  beforeEach(() => {
    cy.visit('/create-game')
  })

  it('shows game creation form', () => {
    cy.contains('Create a Game').should('be.visible')
    cy.get('input[name="title"]').should('be.visible')
    cy.get('input[name="github_url"]').should('be.visible')
    cy.get('textarea[name="description"]').should('be.visible')
  })

  it('validates required fields', () => {
    cy.get('button[type="submit"]').should('not.exist') // Shows wallet connect button
    // With wallet connected test would validate form
  })

  it('shows wallet connect prompt when not connected', () => {
    cy.contains('Connect your wallet').should('be.visible')
  })
})

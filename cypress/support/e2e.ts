// Cypress support file

// Suppress Phantom wallet extension errors in tests
Cypress.on('uncaught:exception', (err) => {
  // Ignore wallet adapter errors in test environment
  if (
    err.message.includes('wallet') ||
    err.message.includes('phantom') ||
    err.message.includes('solana') ||
    err.message.includes('WalletNotConnected')
  ) {
    return false
  }
  return true
})

// Custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here
      connectMockWallet(): Chainable<void>
    }
  }
}

Cypress.Commands.add('connectMockWallet', () => {
  // Mock wallet connection for tests
  cy.window().then((win) => {
    // Inject a mock Phantom wallet
    ;(win as any).solana = {
      isPhantom: true,
      publicKey: {
        toString: () => '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      },
      connect: async () => ({
        publicKey: {
          toString: () => '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        },
      }),
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
      signMessage: async (msg: Uint8Array) => ({ signature: new Uint8Array(64) }),
      isConnected: true,
    }
  })
})

export {}

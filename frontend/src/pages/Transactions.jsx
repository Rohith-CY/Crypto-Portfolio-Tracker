
import { useEffect, useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import portfolioAbi from '../abi/Portfolio.abi.json'
import { CONTRACT_ADDRESS } from '../config/constants'

const CANCELLED_TRANSACTIONS_KEY = 'cryptoPortfolioCancelledTransactions'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadTransactions() {
      try {
        setLoading(true)
        setError('')

        if (!window.ethereum) {
          throw new Error('Please install MetaMask and connect your wallet.')
        }

        const provider = new BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()

        if (network.chainId !== 31337n) {
          throw new Error(
            'Switch MetaMask to Hardhat Local (chain ID 31337).'
          )
        }

        const accounts = await provider.send('eth_accounts', [])

        if (!accounts.length) {
          throw new Error('Connect your wallet to view transaction history.')
        }

        const wallet = accounts[0].toLowerCase()

        const contract = new Contract(
          CONTRACT_ADDRESS,
          portfolioAbi,
          provider
        )

        const [added, removed] = await Promise.all([
          contract.queryFilter(
            contract.filters.HoldingAdded(accounts[0]),
            0,
            'latest'
          ),
          contract.queryFilter(
            contract.filters.HoldingRemoved(accounts[0]),
            0,
            'latest'
          ),
        ])

        const blockchainTransactions = await Promise.all(
          [
            ...added.map(event => ({ event, type: 'Added' })),
            ...removed.map(event => ({ event, type: 'Removed' })),
          ]
            .filter(({ event }) =>
              event.args.owner.toLowerCase() === wallet
            )
            .map(async ({ event, type }) => {
              const block = await provider.getBlock(event.blockNumber)
              const args = event.args

              return {
                id: `${event.transactionHash}-${event.index}`,
                type,
                name: args.name || args.symbol,
                symbol: args.symbol,
                quantity: args.quantity.toString(),
                date: block
                  ? new Date(Number(block.timestamp) * 1000).toLocaleString()
                  : 'Unknown',
                status: 'Confirmed',
                hash: event.transactionHash,
                blockNumber: event.blockNumber,
                index: event.index,
                source: 'blockchain',
              }
            })
        )

        const cancelledTransactions = JSON.parse(
          localStorage.getItem(CANCELLED_TRANSACTIONS_KEY) || '[]'
        )
          .filter(
            tx => tx.wallet?.toLowerCase() === wallet
          )
          .map(tx => ({
            ...tx,
            blockNumber: -1,
            index: 0,
            source: 'local',
          }))

        const allTransactions = [
          ...blockchainTransactions,
          ...cancelledTransactions,
        ]

        allTransactions.sort((a, b) => {
          if (a.source === 'local' && b.source !== 'local') return -1
          if (a.source !== 'local' && b.source === 'local') return 1

          return b.blockNumber - a.blockNumber || b.index - a.index
        })

        if (!cancelled) setTransactions(allTransactions)
      } catch (err) {
        console.error('Failed to load transactions:', err)

        if (!cancelled) {
          setError(
            err.shortMessage ||
              err.message ||
              'Could not load transactions.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadTransactions()

    return () => {
      cancelled = true
    }
  }, [])

  async function copyHash(hash) {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
    } catch {
      window.prompt('Copy transaction hash:', hash)
    }
  }

  return (
    <section className="holdings-section">
      <h2>Transactions</h2>
      <p>View confirmed blockchain transactions and cancelled attempts.</p>

      {loading && <p>Loading transaction history...</p>}

      {error && (
        <p role="alert" style={{ color: '#ff7777', marginTop: '20px' }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="table-wrapper" style={{ marginTop: '24px' }}>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Transaction Details</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6">No transaction history found.</td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.type}</td>
                    <td>{tx.name} ({tx.symbol})</td>
                    <td>{tx.quantity}</td>
                    <td>{tx.date}</td>
                    <td>
                      <span
                        style={{
                          color:
                            tx.status === 'Cancelled'
                              ? '#ff7777'
                              : '#46d39a',
                        }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      {tx.hash ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTransaction(tx)
                            setCopied(false)
                          }}
                        >
                          View Details
                        </button>
                      ) : (
                        <span title="Cancelled before blockchain submission">
                          No transaction hash
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedTransaction && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            marginTop: '24px',
            padding: '24px',
            border: '1px solid #444',
            borderRadius: '12px',
            background: '#171717',
            color: '#fff',
            overflowWrap: 'anywhere',
          }}
        >
          <h3>Transaction Details</h3>
          <p><strong>Type:</strong> {selectedTransaction.type}</p>
          <p>
            <strong>Asset:</strong> {selectedTransaction.name} (
            {selectedTransaction.symbol})
          </p>
          <p><strong>Quantity:</strong> {selectedTransaction.quantity}</p>
          <p><strong>Date:</strong> {selectedTransaction.date}</p>
          <p><strong>Status:</strong> {selectedTransaction.status}</p>
          <p><strong>Block Number:</strong> {selectedTransaction.blockNumber}</p>
          <p><strong>Transaction Hash:</strong></p>
          <p>{selectedTransaction.hash}</p>

          <button
            type="button"
            onClick={() => copyHash(selectedTransaction.hash)}
          >
            {copied ? 'Copied!' : 'Copy Full Hash'}
          </button>

          <button
            type="button"
            style={{ marginLeft: '10px' }}
            onClick={() => setSelectedTransaction(null)}
          >
            Close
          </button>
        </div>
      )}
    </section>
  )
}

export default Transactions


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

import Sidebar from './components/sidebar'
import { connectWallet } from './services/wallet'
import { getPortfolioContract } from './services/contract'

import Dashboard from './pages/Dashboard'
import Holdings from './pages/Holdings'
import AddHolding from './pages/AddHolding'
import Transactions from './pages/Transactions'

const coinColors = {
  BTC: '#f7931a',
  ETH: '#627eea',
  SOL: '#9945ff',
}

const CANCELLED_TRANSACTIONS_KEY = 'cryptoPortfolioCancelledTransactions'

function isMetaMaskCancellation(error) {
  return (
    error?.code === 4001 ||
    error?.info?.error?.code === 4001 ||
    error?.cause?.code === 4001
  )
}

function saveCancelledTransaction(transaction) {
  try {
    const existing = JSON.parse(
      localStorage.getItem(CANCELLED_TRANSACTIONS_KEY) || '[]'
    )

    existing.unshift({
      id: `cancelled-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...transaction,
      status: 'Cancelled',
      hash: null,
      date: new Date().toLocaleString(),
    })

    localStorage.setItem(
      CANCELLED_TRANSACTIONS_KEY,
      JSON.stringify(existing)
    )
  } catch (error) {
    console.error('Could not save cancelled transaction:', error)
  }
}

function App() {
  const [holdings, setHoldings] = useState([])
  const [walletAddress, setWalletAddress] = useState('')
  const [walletLoading, setWalletLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [walletError, setWalletError] = useState('')
  const [status, setStatus] = useState('')

  async function loadHoldings(signer) {
    const contract = getPortfolioContract(signer)
    const result = await contract.getMyHoldings()

    setHoldings(
      result.map((coin) => ({
        id: Number(coin.id),
        name: coin.name,
        symbol: coin.symbol,
        amount: Number(coin.quantity) / 1e6,
        purchasePrice: Number(coin.purchasePrice) / 100,
        price: Number(coin.currentPrice) / 100,
        color: coinColors[coin.symbol] || '#8067ff',
      }))
    )
  }

  useEffect(() => {
    async function restoreWallet() {
      try {
        if (!window.ethereum) return

        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length === 0) return

        const wallet = await connectWallet()
        const network = await wallet.provider.getNetwork()

        if (Number(network.chainId) !== 31337) return

        setWalletAddress(wallet.address)
        await loadHoldings(wallet.signer)
      } catch (error) {
        console.error('Could not restore wallet:', error)
      }
    }

    restoreWallet()
  }, [])

  async function handleConnectWallet() {
    setWalletLoading(true)
    setWalletError('')
    setStatus('')

    try {
      const wallet = await connectWallet()
      const network = await wallet.provider.getNetwork()

      if (Number(network.chainId) !== 31337) {
        throw new Error(
          'Switch MetaMask to Hardhat Local (chain ID 31337), then connect again.'
        )
      }

      setWalletAddress(wallet.address)
      await loadHoldings(wallet.signer)
      setStatus('Connected to your portfolio on Hardhat Local.')
    } catch (error) {
      setWalletError(
        error?.shortMessage ||
          error?.message ||
          'Could not connect to the contract.'
      )
    } finally {
      setWalletLoading(false)
    }
  }

  async function addHolding(holding) {
    setBusy(true)
    setWalletError('')
    setStatus('')

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask and connect your wallet.')
      }

      const wallet = await connectWallet()
      const network = await wallet.provider.getNetwork()

      if (Number(network.chainId) !== 31337) {
        throw new Error('Switch MetaMask to Hardhat Local (chain ID 31337).')
      }

      const quantity = Math.round(Number(holding.amount) * 1e6)
      const purchasePrice = Math.round(Number(holding.purchasePrice) * 100)
      const currentPrice = Math.round(Number(holding.price) * 100)

      if (
        !holding.name?.trim() ||
        !holding.symbol?.trim() ||
        quantity <= 0 ||
        purchasePrice <= 0 ||
        currentPrice <= 0
      ) {
        throw new Error(
          'Enter a name, symbol, quantity, and prices greater than zero.'
        )
      }

      setStatus('Waiting for MetaMask transaction approval...')

      const contract = getPortfolioContract(wallet.signer)
      const tx = await contract.addHolding(
        holding.name.trim(),
        holding.symbol.trim().toUpperCase(),
        quantity,
        purchasePrice,
        currentPrice
      )

      setStatus('Transaction submitted. Waiting for confirmation...')
      await tx.wait()

      setWalletAddress(wallet.address)
      await loadHoldings(wallet.signer)
      setStatus('Holding saved to the blockchain!')
    } catch (error) {
      if (isMetaMaskCancellation(error)) {
        saveCancelledTransaction({
          type: 'Added',
          name: holding.name?.trim() || 'Unknown asset',
          symbol: holding.symbol?.trim().toUpperCase() || 'N/A',
          quantity: String(holding.amount ?? ''),
          wallet: walletAddress,
        })

        setWalletError('')
        setStatus(
          'Transaction cancelled in MetaMask. Saved in transaction history.'
        )
      } else {
        setWalletError(
          error?.shortMessage ||
            error?.reason ||
            error?.message ||
            'Could not save holding.'
        )
        setStatus('')
      }
    } finally {
      setBusy(false)
    }
  }

  async function removeHolding(id) {
    setBusy(true)
    setWalletError('')
    setStatus('')

    try {
      const wallet = await connectWallet()
      const network = await wallet.provider.getNetwork()

      if (Number(network.chainId) !== 31337) {
        throw new Error('Switch MetaMask to Hardhat Local (chain ID 31337).')
      }

      const contract = getPortfolioContract(wallet.signer)
      setStatus('Waiting for MetaMask transaction approval...')

      const tx = await contract.removeHolding(id)
      await tx.wait()

      setWalletAddress(wallet.address)
      await loadHoldings(wallet.signer)
      setStatus('Holding removed from the blockchain.')
    } catch (error) {
      if (isMetaMaskCancellation(error)) {
        const holding = holdings.find((coin) => coin.id === Number(id))

        saveCancelledTransaction({
          type: 'Removed',
          name: holding?.name || 'Unknown asset',
          symbol: holding?.symbol || 'N/A',
          quantity: String(holding?.amount ?? ''),
          wallet: walletAddress,
        })

        setWalletError('')
        setStatus(
          'Removal cancelled in MetaMask. Saved in transaction history.'
        )
      } else {
        setWalletError(
          error?.shortMessage ||
            error?.reason ||
            error?.message ||
            'Could not remove holding.'
        )
        setStatus('')
      }
    } finally {
      setBusy(false)
    }
  }

  const totalValue = holdings.reduce(
    (total, coin) => total + coin.amount * coin.price,
    0
  )

  const totalInvested = holdings.reduce(
    (total, coin) => total + coin.amount * coin.purchasePrice,
    0
  )

  const profit = totalValue - totalInvested

  const profitPercentage =
    totalInvested > 0 ? (profit / totalInvested) * 100 : 0

  const formatMoney = (amount) =>
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : ''

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <header className="topbar">
            <div>
              <h1>Crypto Portfolio</h1>
              <p>Track your digital assets in one place.</p>
            </div>

            <button
              className="wallet-button"
              type="button"
              onClick={handleConnectWallet}
              disabled={walletLoading || busy}
            >
              {walletLoading
                ? 'Connecting...'
                : walletAddress
                  ? shortAddress
                  : 'Connect Wallet'}
            </button>
          </header>

          {walletAddress && (
            <div className="wallet-status">
              <span className="wallet-dot" />
              Wallet connected: {walletAddress}
            </div>
          )}

          {walletError && (
            <div className="wallet-error">{walletError}</div>
          )}

          {status && <p role="status">{status}</p>}

          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  holdings={holdings}
                  totalValue={totalValue}
                  totalInvested={totalInvested}
                  profit={profit}
                  profitPercentage={profitPercentage}
                  formatMoney={formatMoney}
                />
              }
            />

            <Route
              path="/holdings"
              element={
                <Holdings
                  holdings={holdings}
                  formatMoney={formatMoney}
                  removeHolding={removeHolding}
                  busy={busy}
                />
              }
            />

            <Route
              path="/add-holding"
              element={
                <AddHolding
                  addHolding={addHolding}
                  busy={busy}
                />
              }
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

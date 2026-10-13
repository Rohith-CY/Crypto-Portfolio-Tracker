import { BrowserProvider } from 'ethers'

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask first.')
  }

  const provider = new BrowserProvider(window.ethereum)
  const accounts = await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()

  return {
    provider,
    signer,
    address: accounts[0],
  }
}

export async function getConnectedWallet() {
  if (!window.ethereum) {
    return null
  }

  const provider = new BrowserProvider(window.ethereum)
  const accounts = await provider.send('eth_accounts', [])

  if (accounts.length === 0) {
    return null
  }

  return {
    provider,
    signer: await provider.getSigner(),
    address: accounts[0],
  }
}
import { Contract } from 'ethers'
import portfolioAbi from '../abi/Portfolio.abi.json'
import { CONTRACT_ADDRESS } from '../config/constants'

export function getPortfolioContract(signerOrProvider) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Set the contract address in constants.js')
  }

  return new Contract(CONTRACT_ADDRESS, portfolioAbi, signerOrProvider)
}
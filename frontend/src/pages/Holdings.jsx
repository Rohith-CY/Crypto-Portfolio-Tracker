
function Holdings({ holdings, formatMoney, removeHolding, busy }) {
  return (
    <section className="holdings-section">
      <div className="section-heading">
        <div>
          <h2>My Holdings</h2>
          <p>All your cryptocurrency assets stored on the blockchain.</p>
        </div>
        <span className="coin-count">{holdings.length} assets</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Current Price</th>
              <th>Total Value</th>
              <th>Profit / Loss</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((coin) => {
              const invested = coin.amount * coin.purchasePrice
              const value = coin.amount * coin.price
              const coinProfit = value - invested

              return (
                <tr key={coin.id}>
                  <td>
                    <div className="coin-name">
                      <span
                        className="coin-icon"
                        style={{ backgroundColor: coin.color }}
                      >
                        {coin.symbol.charAt(0)}
                      </span>
                      <div>
                        <strong>{coin.name}</strong>
                        <span>{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td>{coin.amount} {coin.symbol}</td>
                  <td>${formatMoney(coin.purchasePrice)}</td>
                  <td>${formatMoney(coin.price)}</td>
                  <td>${formatMoney(value)}</td>
                  <td className={coinProfit >= 0 ? 'positive' : 'negative'}>
                    {coinProfit >= 0 ? '+' : '-'}$
                    {formatMoney(Math.abs(coinProfit))}
                  </td>
                  <td>
                    <button
                      className="remove-button"
                      type="button"
                      disabled={busy}
                      onClick={() => removeHolding(coin.id)}
                    >
                      {busy ? 'Processing...' : 'Remove'}
                    </button>
                  </td>
                </tr>
              )
            })}

            {holdings.length === 0 && (
              <tr>
                <td colSpan="7">No holdings found. Connect your wallet to load your assets.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Holdings

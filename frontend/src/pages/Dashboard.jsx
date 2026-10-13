
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = [
  '#f7931a',
  '#627eea',
  '#9945ff',
  '#14b8a6',
  '#ec4899',
  '#f59e0b',
  '#3b82f6',
  '#22c55e',
]

function Dashboard({
  holdings = [],
  totalValue,
  totalInvested,
  profit,
  profitPercentage,
  formatMoney,
}) {
  // Use the correct fields from App.jsx:
  // amount = quantity, price = current price per coin
  const chartData = holdings
    .map((holding) => ({
      name: holding.name || holding.symbol || 'Unknown Asset',
      symbol: holding.symbol || '',
      value: Number(holding.amount) * Number(holding.price),
    }))
    .filter(
      (holding) =>
        Number.isFinite(holding.value) && holding.value > 0
    )

  return (
    <>
      {/* Summary cards */}
      <section className="summary-grid">
        <article className="summary-card">
          <p>Total Portfolio Value</p>
          <h2>${formatMoney(totalValue)}</h2>
        </article>

        <article className="summary-card">
          <p>Total Invested</p>
          <h2>${formatMoney(totalInvested)}</h2>
        </article>

        <article className="summary-card">
          <p>Profit / Loss</p>
          <h2 className={profit >= 0 ? 'positive' : 'negative'}>
            {profit >= 0 ? '+' : '-'}${formatMoney(Math.abs(profit))}
          </h2>
          <span className={profit >= 0 ? 'positive' : 'negative'}>
            {profitPercentage >= 0 ? '+' : ''}
            {profitPercentage.toFixed(2)}%
          </span>
        </article>
      </section>

      {/* Portfolio overview */}
      <section className="holdings-section">
        <h2>Portfolio Overview</h2>
        <p>
          You currently have {holdings.length} holdings saved on the blockchain.
        </p>
        <p>Use My Holdings to view individual assets and their prices.</p>
      </section>

      {/* Portfolio allocation chart */}
      <section className="holdings-section">
        <h2>Portfolio Allocation</h2>
        <p>Distribution of your holdings by current value.</p>

        {chartData.length > 0 ? (
          <div
            style={{
              width: '100%',
              height: 350,
              marginTop: 20,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`${entry.symbol}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    `$${formatMoney(Number(value))}`,
                    'Current Value',
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ marginTop: 20 }}>
            No positive-value holdings are available for the chart.
            Check your holding quantities and current prices.
          </p>
        )}
      </section>
    </>
  )
}

export default Dashboard

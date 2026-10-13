function AddHoldingForm({ onAdd, disabled }) {
  function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const holding = {
      name: data.get('name').trim(),
      symbol: data.get('symbol').trim().toUpperCase(),
      amount: Number(data.get('amount')),
      purchasePrice: Number(data.get('purchasePrice')),
      price: Number(data.get('price')),
    }

    if (
      !holding.name ||
      !holding.symbol ||
      !Number.isFinite(holding.amount) ||
      !Number.isFinite(holding.purchasePrice) ||
      !Number.isFinite(holding.price) ||
      holding.amount <= 0 ||
      holding.purchasePrice <= 0 ||
      holding.price <= 0
    ) {
      alert('Enter valid details. Quantity and prices must be positive.')
      return
    }

    onAdd(holding)
    form.reset()
  }

  return (
    <section className="add-section">
      <h2>Add a Holding</h2>
      <p>Enter the purchase price and current price for an asset.</p>

      <form className="holding-form" onSubmit={handleSubmit}>
        <label>
          Cryptocurrency
          <input name="name" placeholder="e.g. Bitcoin" required />
        </label>

        <label>
          Symbol
          <input name="symbol" placeholder="e.g. BTC" required />
        </label>

        <label>
          Quantity
          <input
            name="amount"
            type="number"
            min="0.00000001"
            step="any"
            placeholder="e.g. 0.5"
            required
          />
        </label>

        <label>
          Purchase price per coin ($)
          <input
            name="purchasePrice"
            type="number"
            min="0.01"
            step="any"
            placeholder="e.g. 40000"
            required
          />
        </label>

        <label>
          Current price per coin ($)
          <input
            name="price"
            type="number"
            min="0.01"
            step="any"
            placeholder="e.g. 50000"
            required
          />
        </label>

        <button className="wallet-button" type="submit" disabled={disabled}>
          {disabled ? 'processing....' : 'Add Holding'}
        </button>
      </form>
    </section>
  )
}

export default AddHoldingForm
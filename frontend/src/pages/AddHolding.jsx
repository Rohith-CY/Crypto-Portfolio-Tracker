
import AddHoldingForm from '../components/AddHoldingForm'

function AddHolding({ addHolding, busy }) {
  return (
    <section className="holdings-section">
      <h2>Add a Holding</h2>
      <p>Add a cryptocurrency to your portfolio using a blockchain transaction.</p>

      <div style={{ maxWidth: '700px', marginTop: '24px' }}>
        <AddHoldingForm onAdd={addHolding} disabled={busy} />
      </div>
    </section>
  )
}

export default AddHolding

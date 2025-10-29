import React from 'react';

function Home() {
  const [amount, setAmount] = React.useState(1);
  const [method, setMethod] = React.useState('CARD');
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function createIntent(e) {
    e.preventDefault();
    setLoading(true);
    setUrl('');

    try {
      const baseUrl = window.location.origin;
      const tag = method.toLowerCase() + '_success';

      const r = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          tag,
          success_url: `${baseUrl}/success`,
          failed_url: `${baseUrl}/failed`,
          closed_url: `${baseUrl}/closed`,
        }),
      });

      console.log('Response status:', r.status);
      const j = await r.json();
      console.log('Response data:', j);

      if (!r.ok) throw new Error(j.error || String(r.status));

      // Be liberal in what we accept back from the API
      const redirectUrl = j.embed_url || j.pay_url || j.payment_url;
      if (!redirectUrl) {
        console.error('API response missing redirect URL field:', j);
        throw new Error('No redirect URL returned by API');
      }

      console.log('Redirecting to:', redirectUrl);
      setUrl(redirectUrl);

      // open new tab (avoids history issues); change to window.location.href if you prefer same-tab
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Create intent failed:', err);
      alert('Create intent failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>LA08 Checkout Launcher</h1>
      <form onSubmit={createIntent}>
        <label>
          Amount
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label>
          Method
          <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="CARD">CARD</option>
            <option value="VISA">VISA</option>
            <option value="MADA">MADA</option>
            <option value="MC">MC</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Intent'}</button>
      </form>
      {url ? <div id="url">URL: {url}</div> : null}
    </main>
  );
}

export default Home;




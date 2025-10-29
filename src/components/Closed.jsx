function Closed() {
  return (
    <main className="page-closed">
      <h1>Payment Closed</h1>
      <p>This intent has closed after exhausting retries. Capture the URL for the workbook.</p>
      <p id="url">URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
      <a href="/">Back to launcher</a>
    </main>
  );
}

export default Closed;




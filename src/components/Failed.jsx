function Failed() {
  return (
    <main className="page-failed">
      <h1>Payment Failed</h1>
      <p>Screenshot this failure state with the URL clearly visible.</p>
      <p id="url">URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
      <a href="/">Back to launcher</a>
    </main>
  );
}

export default Failed;




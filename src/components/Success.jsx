function Success() {
  return (
    <main className="page-success">
      <h1>Payment Successful 🎉</h1>
      <p>Capture this page with the full URL visible for your submission.</p>
      <p id="url">URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
      <a href="/">Back to launcher</a>
    </main>
  );
}

export default Success;




import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Success from './components/Success';
import Failed from './components/Failed';
import Closed from './components/Closed';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/success" element={<Success />} />
      <Route path="/failed" element={<Failed />} />
      <Route path="/closed" element={<Closed />} />
    </Routes>
  );
}

export default App;




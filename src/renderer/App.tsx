import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Editor from './pages/editor';
import Home from './pages/home';

const Hello = () => {
  const [page, setPage] = useState<string>('home');

  switch (page) {
    case 'home':
      return <Home onClick={() => setPage('editor')} />;
    case 'editor':
      return <Editor />;
    default:
      return <h1>404</h1>;
  }
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

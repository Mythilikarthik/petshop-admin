
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Directory from './Pages/Directory';
import PetHealth from './Pages/PetHealth';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/pet-health" element={<PetHealth />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

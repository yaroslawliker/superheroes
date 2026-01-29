import { Outlet } from 'react-router-dom';
import Navbar from './pages/parts/Navbar';

import "./App.css"
import Footer from './pages/parts/Footer';

function App() {
  return (
    <div className="app-layout">
      <header><Navbar/></header>
      
      <main className='main'>
        <Outlet/>
      </main>

      <footer><Footer/></footer>
    </div>
  );
}

export default App;
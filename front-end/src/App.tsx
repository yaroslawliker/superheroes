import { Outlet } from 'react-router-dom';
import Navbar from './pages/common/Navbar';

import "./App.css"
import Footer from './pages/common/Footer';

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
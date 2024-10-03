import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Signup from './pages/signup'

function App() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App

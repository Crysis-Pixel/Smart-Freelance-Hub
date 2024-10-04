import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Signup from './pages/signup'
import Profile from './pages/profile'

function App() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App

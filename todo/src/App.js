import logo from './logo.svg';
import './App.css';
import Todo from './Components/Todo';
import LoginPage from './Components/Login';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/Password/forgot-password';
import WebSocketComponent from './Components/Socket';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes> 
          <Route path = "/" element={<LoginPage></LoginPage>}></Route>
          <Route path='/Login' element={<LoginPage></LoginPage>}></Route>
          <Route path='/Todo' element={<Todo></Todo>}></Route>
          <Route path='/SignUp' element={<SignUp></SignUp>}></Route>
          <Route path='/Socket' element={<WebSocketComponent></WebSocketComponent>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
          <Route path='*' element={<LoginPage></LoginPage>}></Route>
        </Routes>
      </BrowserRouter>
      {/* <LoginPage></LoginPage> */}
    </div>
  );
}

export default App;

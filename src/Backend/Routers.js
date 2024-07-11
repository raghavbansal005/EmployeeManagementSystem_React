import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginSignup from "../Frontend/LoginSignup/LoginSignup";
import Header from "../Frontend/HomePage/Header";

const Routers = () =>{
    return(
    <div>
      <BrowserRouter >
      <Routes>
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/header" element={<Header />} />
        <Route path="/" element={<LoginSignup />} />    
      </Routes>
      </BrowserRouter>
    </div>
    )
}

export default Routers;
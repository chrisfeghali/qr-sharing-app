import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import Landing from "./components/landing/Landing";

function App(props) {
  let auth = props.auth;
  auth = false;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            auth ? (
              <Navigate replace to="home" />
            ) : (
              <Navigate replace to="landing" />
            )
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />}>
          <Route index element={<Navigate replace to="signin" />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

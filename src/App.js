import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import Landing from "./components/landing/Landing";
import RequireAuth from "./components/RequireAuth";
import RequireNonAuth from "./components/RequireNonAuth";

function App(props) {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route index element={<Navigate replace to="home" />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/landing"
            element={
              <RequireNonAuth>
                <Landing />
              </RequireNonAuth>
            }
          >
            <Route index element={<Navigate replace to="signin" />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

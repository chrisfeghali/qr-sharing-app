import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/Signup";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Home from "./components/home/Home";
import Landing from "./components/landing/Landing";
import ErrorPage from "./components/errorPage/ErrorPage";
import RequireAuth from "./components/RequireAuth";
import RequireNonAuth from "./components/RequireNonAuth";
import RequireAdmin from "./components/RequireAdmin";
import HomePage from "./components/HomePage/HomePage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import CodePage from "./components/CodePage/CodePage";
import MemberPage from "./components/MemberPage/MemberPage";
import InvitePage from "./components/InvitePage/InvitePage";
import EditGroupPage from "./components/EditGroupPage/EditGroupPage";
import { GroupProvider } from "./contexts/GroupContext";

function App(props) {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route index element={<Navigate replace to="home" />} />
          <Route
            path="home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate replace to="homepage" />} />
            <Route path="homepage" element={<HomePage />} />
            <Route path="edit-profile" element={<ProfilePage />} />
            <Route path="group/:groupID">
              <Route index element={<Navigate replace to="codes" />} />
              <Route
                path="codes"
                element={
                  <GroupProvider>
                    <CodePage />
                  </GroupProvider>
                }
              />
              <Route
                path="members"
                element={
                  <GroupProvider>
                    <MemberPage />
                  </GroupProvider>
                }
              />

              <Route
                path="invites"
                element={
                  <GroupProvider>
                    <RequireAdmin>
                      <InvitePage />
                    </RequireAdmin>
                  </GroupProvider>
                }
              />
              <Route
                path="edit-group"
                element={
                  <GroupProvider>
                    <RequireAdmin>
                      <EditGroupPage />
                    </RequireAdmin>
                  </GroupProvider>
                }
              />
            </Route>
          </Route>
          <Route
            path="landing"
            element={
              <RequireNonAuth>
                <Landing />
              </RequireNonAuth>
            }
          >
            <Route index element={<Navigate replace to="signin" />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="resetpassword" element={<ResetPassword />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

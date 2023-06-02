import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  AddUserToGroup,
  UpdateUserName,
  UpdateEmail,
} from "../apis/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as authSignout,
  sendPasswordResetEmail,
  updateEmail as authUpdateEmail,
  updatePassword as authUpdatePassword,
  updateProfile as authUpdateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = React.createContext();
const provider = new GoogleAuthProvider();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState();

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signInPopup() {
    return signInWithPopup(auth, provider);
  }

  function signOut() {
    return authSignout(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    const result = authUpdateEmail(currentUser, email);
    UpdateEmail(email);
    return result;
  }

  function updatePassword(password) {
    return authUpdatePassword(currentUser, password);
  }

  function updateName(userName) {
    const result = authUpdateProfile(currentUser, { displayName: userName });
    UpdateUserName(userName);
    return result;
  }

  async function signUpAndUpdateName(email, password, userName) {
    const signUpResult = await signUp(email, password);
    await authUpdateProfile(signUpResult.user, {
      displayName: userName,
    });
    return signUpResult;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, function (user) {
      setCurrentUser(user);
      if (user) {
        setUserName(user.displayName);
        setEmail(user.email);
        if (joinCode) {
          try {
            AddUserToGroup(joinCode);
          } catch (err) {
            //console.log(err.code);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [joinCode]);

  const value = {
    currentUser,
    userName,
    email,
    setUserName,
    setEmail,
    signIn,
    signInPopup,
    signUpAndUpdateName,
    signOut,
    resetPassword,
    updateEmail,
    updatePassword,
    updateName,
    joinCode,
    setJoinCode,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

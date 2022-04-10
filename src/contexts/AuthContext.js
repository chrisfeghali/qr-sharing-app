import React, { useContext, useState, useEffect } from "react";
import { auth } from "../apis/firebase";
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
  const [loading, setLoading] = useState(true);
  const [, setNewUserName] = useState(false);

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
    return authUpdateEmail(currentUser, email);
  }

  function updatePassword(password) {
    return authUpdatePassword(currentUser, password);
  }

  function updateName(userName) {
    return authUpdateProfile(currentUser, { displayName: userName });
  }

  async function signUpAndUpdateName(email, password, userName) {
    const signUpResult = await signUp(email, password);
    await authUpdateProfile(signUpResult.user, {
      displayName: userName,
    });
    setNewUserName(userName); //Without this the userName isn't updated on the first render
    return signUpResult;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, function (user) {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signIn,
    signInPopup,
    signUpAndUpdateName,
    signOut,
    resetPassword,
    updateEmail,
    updatePassword,
    updateName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

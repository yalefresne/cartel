import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * @param {AuthContext} AuthContext should be used with useContext() on children widgets of Wrapped in AuthContextProvider
 */
const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

/**
 * Authentication Provider - Used only once at the root widget of the app.
 * @param  {children} children widgets can access Authentication state of the app.
 * @return {user} provides user object to child widgets, that can be accessed via @const {AuthContext}
 *          user is null, when UnAuthorized.
 *          user is undefined, when firebase is initializing and not fully loaded.
 *          user is an Object, when Authorized is successful.
 */
function AuthContextProvider({ children }) {

  const [user, setUser] = useState(undefined);
  
  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth , AuthContextProvider };
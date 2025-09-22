import React, { createContext } from 'react'
export const authDataContext = createContext();
let serverUrl = "https://linkedin-backend-q389.onrender.com"
let value = {
    serverUrl
}
function AuthContext({children}) {
  return (
    <authDataContext.Provider value={value}>
        <div>{children}</div>
    </authDataContext.Provider>
  )
}

export default AuthContext

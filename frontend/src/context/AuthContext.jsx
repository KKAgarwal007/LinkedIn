import React, { createContext } from 'react'
export const authDataContext = createContext();
let serverUrl = "http://localhost:8000"
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
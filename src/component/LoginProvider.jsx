import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// step1 context 만들기
export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  // email
  // nickName
  const [id, setId] = useState("");
  const [nickName, setNickName] = useState("");
  const [expired, setExpired] = useState(0);
  const [authority, setAuthority] = useState([]);

  // 새로고침 후에 로그인 상태 유지
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    login(token);
  }, []);

  // isLoggedIn
  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }
  // hasEmail -> 권한 있는 지? 확인
  function hasAccess(param) {
    return id == param;
  }

  function isAdmin() {
    return authority.includes("admin");
  }

  // login
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setNickName(payload.nickName);
    setAuthority(payload.scope.split(" ")); // "admin manager user"
  }

  // logout
  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setId("");
    setNickName("");
    setAuthority([]);
  }

  return (
    <LoginContext.Provider
      value={{
        id: id,
        nickName: nickName,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserContext } from "../../../store/UserContext";

export const useHeaderAuth = () => {
  const navigate = useNavigate();
  const { currentRole, setUserId, setUserRole } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [name, setName] = useState("");

  const logout = useCallback(() => {
    localStorage.setItem("authToken", "");
    localStorage.removeItem("nickname");
    localStorage.removeItem("name");
    setUserId(null);
    setUserRole(null);
    setIsLogin(false);
    setName("");
    toast.success("로그아웃되었습니다. 다시 로그인해주세요.");
    void navigate("/");
  }, [navigate, setUserId, setUserRole]);

  const refresh = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const storedName = localStorage.getItem("name");
    setIsManager(localStorage.getItem("userRole") === "manager");

    if (!token) {
      setIsLogin(false);
      setName("");
      return;
    }
    if (isTokenExpired(token)) logout();
    else {
      if (storedName) setName(storedName);
      setIsLogin(true);
    }
  }, [logout]);

  useEffect(() => {
    refresh();
  }, [currentRole, refresh]);

  return { isLogin, isManager, logout, name, refresh };
};

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return !exp || Math.floor(Date.now() / 1000) > exp;
  } catch {
    return true;
  }
};

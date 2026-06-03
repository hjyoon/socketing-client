import { useState } from "react";
import { useNavigate } from "react-router";
import LoginModal from "../../organisms/auth/LoginModal";
import JoinModal from "../../organisms/auth/JoinModal";
import HeaderLogo from "../../molecules/header-logo/HeaderLogo";
import HeaderActions from "./HeaderActions";
import HeaderSearch from "./HeaderSearch";
import { useHeaderAuth } from "./useHeaderAuth";

const Header = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const auth = useHeaderAuth();

  const handleLoginSuccess = () => {
    auth.refresh();
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <header className="flex h-[76px] items-center justify-between pl-6 pr-4 py-4 bg-black text-white">
        <div className="flex items-center flex-shrink-0">
          <HeaderLogo />
        </div>
        <HeaderSearch navigate={navigate} />
        <HeaderActions
          isLogin={auth.isLogin}
          isManager={auth.isManager}
          name={auth.name}
          onJoin={() => setIsJoinModalOpen(true)}
          onLogin={() => setIsLoginModalOpen(true)}
          onLogout={auth.logout}
          onMyPage={() => void navigate("/mypage")}
          onRegister={() => void navigate("/register")}
        />
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </>
  );
};

export default Header;

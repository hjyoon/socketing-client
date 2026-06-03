import Button from "../../atoms/buttons/Button";

interface Props {
  isLogin: boolean;
  isManager: boolean;
  name: string;
  onJoin: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onMyPage: () => void;
  onRegister: () => void;
}

const HeaderActions = (props: Props) => (
  <div className="flex ml-2 space-x-1 sm:w-full md:w-[70%] lg:w-[60%] items-center justify-end">
    {!props.isLogin ? (
      <GuestActions onJoin={props.onJoin} onLogin={props.onLogin} />
    ) : (
      <UserActions {...props} />
    )}
  </div>
);

const GuestActions = ({
  onJoin,
  onLogin,
}: Pick<Props, "onJoin" | "onLogin">) => (
  <>
    <ResponsiveButton onClick={onJoin} variant="dark">
      회원가입
    </ResponsiveButton>
    <ResponsiveButton onClick={onLogin} variant="secondary">
      로그인
    </ResponsiveButton>
  </>
);

const UserActions = (props: Props) => (
  <>
    <span className="hidden md:inline text-white pr-2">
      <span className="font-bold">{props.name}</span>님, 안녕하세요
    </span>
    <ResponsiveButton onClick={props.onLogout} variant="dark">
      로그아웃
    </ResponsiveButton>
    {props.isManager ? (
      <Button
        variant="secondary"
        onClick={props.onRegister}
        className="hidden md:inline-block"
      >
        공연 등록하기
      </Button>
    ) : (
      <ResponsiveButton onClick={props.onMyPage} variant="secondary">
        마이 페이지
      </ResponsiveButton>
    )}
  </>
);

const ResponsiveButton = ({
  children,
  onClick,
  variant,
}: {
  children: string;
  onClick: () => void;
  variant: "dark" | "secondary";
}) => (
  <>
    <Button
      variant={variant}
      onClick={onClick}
      className="hidden md:inline-block"
    >
      {children}
    </Button>
    <Button
      variant={variant}
      onClick={onClick}
      size="sm"
      className="md:hidden text-[15px]"
    >
      {children}
    </Button>
  </>
);

export default HeaderActions;

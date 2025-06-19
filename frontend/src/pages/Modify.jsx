// 프로필 수정 페이지
const Modify = ({ history }) => {
const { user, userList } = useUserState();
const [id, onChangeId] = useInput(user.userId);
const[pwd, onChangePwd] = useInput("");
const [nowpwd, onChangeNowPwd] = useInput("");
const [confirmPwd, onChangeConfirmPwd] = useInput("");
const [errorMessage, setErrorMessage] = useState({
  idError: "",
  pwdError: "",
  confirmPwdError: "",
});
const { idError, pwdError, confirmPwdError, nowPwdError } = errorMessage;


};
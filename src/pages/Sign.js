const [id, setId] = useState('');
const [password, setPassword] = useState('');
const [phone, setPassword] = useState('')
const [confirm, setConfirm] = useState('');
const [gender, setGender] = useState('')
const [birthdate, setBirthdate] = useState('')

const [idError, setIdError] = useState('');
const [passwordError, setPasswordError] = useState('');
const [confirmError, setConfirmError] = useState('');

const [isIdCheck, setIsIdCheck] = useState(false); // 중복 검사를 했는지 안했는지
const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 사용 가능한지 아닌지

const onChangeIdHandler = (e) => {  //ID, PW 입력할 때마다 해당 값의 변화 감지, 업데이트 
    const idValue = e.target.value;
    setId(idValue);
    idCheckHandler(idValue);
  }

  const onChangePasswordHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
      passwordCheckHandler(value, confirm);
    } else {
      setConfirm(value);
      passwordCheckHandler(password, value);
    }
  }

  // ID 유효성 검사, 중복 검사
  const idCheckHandler = async (id) => {
    const idRegex = /^[a-z\d]{5,10}$/;
    if (email === '') {
      setIdError('아이디를 입력해주세요.');
      setIsIdAvailable(false);
      return false;
    } else if (!idRegex.test(id)) {
      setIdError('아이디는 5~10자의 영소문자, 숫자만 입력 가능합니다.');
      setIsIdAvailable(false);
      return false;
    }
    try {
      const responseData = await idDuplicateCheck(id);
      if (responseData) {
        setIdError('사용 가능한 아이디입니다.');
        setIsIdCheck(true);
        setIsIdAvailable(true);
        return true;
      } else {
        setIdError('이미 사용중인 아이디입니다.');
        setIsIdAvailable(false);
        return false;
      }
    } catch (error) {
      alert('서버 오류입니다. 관리자에게 문의하세요.');
      console.error(error);
      return false;
    }
  }

  // 비밀번호 유효성 검사
  const passwordCheckHandler = (password, confirm) => {
    const passwordRegex = /^[a-z\d!@*&-_]{8,16}$/;
    if (password === '') {
      setPasswordError('비밀번호를 입력해주세요.');
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('비밀번호는 8~16자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.');
      return false;
    } else if (confirm !== password) {
      setPasswordError('');
      setConfirmError('비밀번호가 일치하지 않습니다.');
      return false;
    } else {
      setPasswordError('');
      setConfirmError('');
      return true;
    }
  }

// 회원가입 요청을 서버에 전송 -> ID,PW 유효성 검사를 실시하는 함수 호출 후 모든 결과값이 true일 때 요청 전송
const signupHandler = async (e) => {
    e.preventDefault();
    
    const idCheckresult = await idCheckHandler(id);
    if (idCheckresult) setIdError('');
    else return;
    if (!isIdCheck || !isIdAvailable) {
      alert('아이디 중복 검사를 해주세요.');
      return;
    }

    const passwordCheckResult = passwordCheckHandler(password, confirm);
    if (passwordCheckResult) { setPasswordError(''); setConfirmError(''); }
    else return;

    try {
      const responseData = await signup(id, password, confirm);
      if (responseData) {
        localStorage.setItem('loginId', id);
        setOpenModal(true);
      } else {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      console.error(error);
    }
  }

  //회원가입 UI 구현
  return (
    <>
      <SignupPageHeader />
      <Wrapper>
        <Form onSubmit={signupHandler}>
          <InputWrapper>
            <InputContainer>
              <label htmlFor='email'>이메일</label>
              <Input
                onChange={onChangeIdHandler}
                type="text"
                email='email'
                name='name'
                value={id}
                placeholder='아이디 입력'
                theme='underLine'
                maxLength={10}
              />
              {idError && <small className={isIdAvailable ? 'idAvailable' : ''}>{idError}</small>}
            </InputContainer>
            <InputContainer>
              <label htmlFor='email'>비밀번호</label>
              <Input
                onChange={onChangePasswordHandler}
                type="password"
                id='password'
                name='password'
                value={password}
                placeholder='비밀번호 입력'
                theme='underLine'
                maxLength={16}
              />
              {passwordError && <small>{passwordError}</small>}
              <Input
                onChange={onChangePasswordHandler}
                type="password"
                id='confirm'
                name='confirm'
                value={confirm}
                placeholder='비밀번호 확인'
                theme='underLine'
                maxLength={16}
              />
              {confirmError && <small>{confirmError}</small>}
            </InputContainer>
          </InputWrapper>
          <ButtonContainer>
            <button type='submit'>가입하기</button>
          </ButtonContainer>
        </Form>
        {setOpenModal ? openModal && (<SignupModal />) : null}
      </Wrapper>
    </>
  )
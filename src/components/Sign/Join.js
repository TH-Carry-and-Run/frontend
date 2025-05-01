// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ProfileFormInput from './ProfileFormInput'; // 입력 필드 컴포넌트
// import { Helmet } from 'react-helmet';

// const Join = () => {
//   // 이메일과 비밀번호 상태를 관리
//   const [formData, setFormData] = useState({ email: '', password: '' });
  
//   // 이메일과 비밀번호 오류 메시지 상태를 관리
//   const [error, setError] = useState({ email: '', password: '' });

//   // 페이지 이동을 위한 useNavigate 훅
//   const navigate = useNavigate();

//   // 모든 입력값이 정상적으로 입력되었는지 확인
//   let isActivated = false;
//   if (error.email === 'noError' && error.password === 'noError') {
//     isActivated = true; // 오류가 없으면 버튼 활성화
//   }

//   // '다음' 버튼 클릭 시 프로필 설정 페이지로 이동
//   const handleClick = () => {
//     navigate('/join/profile', { state: formData });
//   };

//   return (
//     <S.Main>
//       {/* 페이지 제목 설정 */}
//       <Helmet>
//         <title>회원가입</title>
//       </Helmet>
      
//       <S.LayoutWrapper>
//         <S.Form>
//           <S.Title>이메일로 회원가입</S.Title>

//           {/* 이메일 입력 필드 */}
//           <ProfileFormInput
//             id='email'
//             label='이메일'
//             formData={formData}
//             setFormData={setFormData}
//             error={error}
//             setError={setError}
//             inputProps={{
//               type: 'email',
//               placeholder: '이메일 주소를 입력해 주세요.',
//               autoComplete: 'off',
//             }}
//           />

//           {/* 비밀번호 입력 필드 */}
//           <ProfileFormInput
//             id='password'
//             label='비밀번호'
//             formData={formData}
//             setFormData={setFormData}
//             error={error}
//             setError={setError}
//             inputProps={{
//               type: 'password',
//               placeholder: '비밀번호를 설정해 주세요.',
//               autoComplete: 'off',
//             }}
//           />

//           {/* 다음 버튼 (입력이 정상적이어야 활성화됨) */}
//           <S.NextBtn onClick={handleClick} mode={isActivated ? 'default' : 'disabled'} size='lg'>
//             다음
//           </S.NextBtn>
//         </S.Form>
//       </S.LayoutWrapper>
//     </S.Main>
//   );
// };

// export default Join;

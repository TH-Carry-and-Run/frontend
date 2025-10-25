import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Modify.css'; // CSS 파일 경로는 styles 폴더로 가정
import axiosInstance from '../utils/axiosInstance';
import { FaCamera } from 'react-icons/fa';

const Modify = ({ showToast }) => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        email: '',
        nickname: '',
        username: '',
        gender: '',
        birthDate: '',
        profileImageUrl: 'https://placehold.co/150x150/E6F2FF/4A6CF8?text=TCAR'
    });
    
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // const [profileImageFile, setProfileImageFile] = useState(null); // 이미지 업로드 API가 없으므로 주석 처리

    // --- 페이지가 로드될 때 사용자 정보를 불러오는 기능 ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 백엔드에 현재 로그인된 사용자 정보 요청 (API 명세에는 없지만, 일반적으로 필요)
                const response = await axiosInstance.get('/api/myaccount'); 
                // 받아온 데이터로 profile 상태 업데이트
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...response.data
                }));
            } catch (error) {
                console.error("사용자 정보 로딩 실패:", error);
                showToast("사용자 정보를 불러오는 데 실패했습니다.");
            }
        };
        fetchUserData();
    }, [showToast]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };
    
    // 이미지 변경 로직은 그대로 유지
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile({ ...profile, profileImageUrl: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- ✨ '수정하기' 버튼 클릭 시 실행될 메인 함수 ---
    const handleUpdate = async () => {
        let passwordChanged = false;

        // --- 1. 비밀번호 변경 로직 (입력된 경우에만 실행) ---
        const { currentPassword, newPassword, confirmPassword } = passwords;
        if (currentPassword && newPassword) {
            if (newPassword !== confirmPassword) {
                showToast("새 비밀번호가 일치하지 않습니다.");
                return;
            }
            try {
                // PUT /api/myaccount/reset-password API 호출
                await axiosInstance.put('/api/myaccount/reset-password', {
                    currentPassword,
                    newPassword,
                    confirmPassword
                });
                passwordChanged = true;
            } catch (error) {
                console.error("비밀번호 변경 실패:", error);
                showToast("현재 비밀번호가 일치하지 않거나 오류가 발생했습니다.");
                return; // 비밀번호 변경 실패 시 프로필 수정도 진행하지 않음
            }
        }

        // --- 2. 프로필 정보 수정 로직 ---
        try {
            // PUT /api/myaccount API 호출
            await axiosInstance.put('/api/myaccount', {
                nickname: profile.nickname,
                username: profile.username,
                birthDate: profile.birthDate,
                gender: profile.gender
            });
        } catch (error) {
            console.error("프로필 정보 수정 실패:", error);
            showToast("프로필 정보 수정 중 오류가 발생했습니다.");
            return;
        }

        // --- 3. 최종 결과 알림 ---
        if (passwordChanged) {
            showToast("비밀번호와 프로필 정보가 성공적으로 수정되었습니다.");
        } else {
            showToast("프로필 정보가 성공적으로 수정되었습니다.");
        }
        navigate('/main');
    };
    
    // --- ✨ 회원 탈퇴 기능 추가 ---
    const handleDeactivate = async () => {
        if (window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            try {
                // DELETE /api/myaccount/deactivate API 호출
                await axiosInstance.delete('/api/myaccount/deactivate');
                showToast("회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
                localStorage.removeItem('accessToken'); // 토큰 삭제
                navigate('/login'); // 로그인 페이지로 이동
            } catch (error) {
                console.error("회원 탈퇴 실패:", error);
                showToast("회원 탈퇴 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="modify-page">
            <div className="form-card">
                <h1 className="title">내 정보 수정</h1>
                
                <div className="profile-picture-section">
                    <div className="picture-container">
                        <img src={profile.profileImageUrl} alt="Profile" className="profile-img" />
                        <label htmlFor="profile-image-upload" className="camera-icon-label">
                            <FaCamera className="camera-icon" />
                        </label>
                        <input 
                            id="profile-image-upload" 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">기본 정보</h2>
                    <div className="input-group">
                        <label>이메일</label>
                        <input type="email" value={profile.email} disabled />
                    </div>
                    {/* API 명세에 맞게 '닉네임', '사용자 이름'으로 변경 */}
                    <div className="input-group">
                        <label htmlFor="nickname">닉네임</label>
                        <input id="nickname" name="nickname" type="text" value={profile.nickname} onChange={handleProfileChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">사용자 이름</label>
                        <input id="username" name="username" type="text" value={profile.username} onChange={handleProfileChange} />
                    </div>
                    {/* 성별 선택 기능 추가 */}
                    <div className="input-group">
                        <label>성별</label>
                        <div className="gender-select">
                            <button 
                                className={`gender-btn ${profile.gender === 'MALE' ? 'active' : ''}`}
                                onClick={() => setProfile({...profile, gender: 'MALE'})}>
                                남성
                            </button>
                            <button 
                                className={`gender-btn ${profile.gender === 'FEMALE' ? 'active' : ''}`}
                                onClick={() => setProfile({...profile, gender: 'FEMALE'})}>
                                여성
                            </button>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="birthDate">생년월일</label>
                        <input id="birthDate" name="birthDate" type="date" value={profile.birthDate} onChange={handleProfileChange} />
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">비밀번호 변경</h2>
                    <div className="input-group">
                        <label htmlFor="currentPassword">현재 비밀번호</label>
                        <input id="currentPassword" name="currentPassword" type="password" value={passwords.currentPassword} placeholder="현재 비밀번호를 입력하세요" onChange={handlePasswordChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <input id="newPassword" name="newPassword" type="password" value={passwords.newPassword} placeholder="새 비밀번호 (8자 이상)" onChange={handlePasswordChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" value={passwords.confirmPassword} placeholder="새 비밀번호를 다시 입력하세요" onChange={handlePasswordChange} />
                    </div>
                </div>

                <div className="button-group">
                    <button className="cancel-btn" onClick={() => navigate(-1)}>취소</button>
                    <button className="save-btn" onClick={handleUpdate}>수정하기</button>
                </div>
                
                {/* --- 회원 탈퇴 섹션 추가 --- */}
                <div className="form-section deactivation-section">
                    <h2 className="section-title">회원 탈퇴</h2>
                    <p className="deactivation-text">계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.</p>
                    <button className="deactivate-btn" onClick={handleDeactivate}>회원 탈퇴</button>
                </div>
            </div>
        </div>
    );
};

export default Modify;
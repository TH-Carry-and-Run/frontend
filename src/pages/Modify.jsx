import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Modify.css';
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
    
    // 닉네임 중복 확인 상태 관리
    const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 기존 닉네임은 확인된 것으로 간주

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // --- 페이지 로드 시 사용자 정보 불러오기 ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 백엔드 명세에는 없지만, 수정 페이지 진입 시 기존 데이터를 채워넣기 위해 필요
                const response = await axiosInstance.get('/api/myaccount'); 
                setProfile(prev => ({ ...prev, ...response.data }));
            } catch (error) {
                console.error("사용자 정보 로딩 실패:", error);
                // 실패 시 로그인 페이지로 튕겨내거나 안내 메시지
                // navigate('/login'); 
            }
        };
        fetchUserData();
    }, [navigate]);

    // 프로필 입력 핸들러
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });

        // 닉네임이 변경되면 다시 중복 확인을 받도록 상태 변경
        if (name === 'nickname') {
            setIsNicknameChecked(false);
        }
    };

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    // --- ✨ [추가됨] 닉네임 중복 확인 함수 ---
    // 참조: GET /api/myaccount/nickname/check API 이미지
    const handleCheckNickname = async () => {
        if (!profile.nickname) {
            showToast("닉네임을 입력해주세요.", "warning");
            return;
        }
        try {
            // 쿼리 파라미터로 nickname 전달
            await axiosInstance.get(`/api/myaccount/nickname/check`, {
                params: { nickname: profile.nickname }
            });
            setIsNicknameChecked(true);
            showToast("사용 가능한 닉네임입니다.", "success");
        } catch (error) {
            console.error("닉네임 중복 확인 실패:", error);
            setIsNicknameChecked(false);
            showToast("이미 사용 중인 닉네임입니다.", "error");
        }
    };

    // 이미지 변경 로직 (프론트엔드 프리뷰용)
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

    // --- 수정하기 버튼 클릭 (메인 로직) ---
    const handleUpdate = async () => {
        // 1. 닉네임 중복 확인 여부 체크
        if (!isNicknameChecked) {
            showToast("닉네임 중복 확인을 해주세요.", "warning");
            return;
        }

        let passwordChanged = false;

        // --- 2. 비밀번호 변경 로직 (참조: PUT /api/myaccount/reset-password) ---
        const { currentPassword, newPassword, confirmPassword } = passwords;
        if (currentPassword || newPassword || confirmPassword) { // 하나라도 입력했다면 변경 시도
            if (!currentPassword || !newPassword || !confirmPassword) {
                showToast("비밀번호 변경을 위해 모든 필드를 입력해주세요.", "warning");
                return;
            }
            if (newPassword !== confirmPassword) {
                showToast("새 비밀번호가 일치하지 않습니다.", "error");
                return;
            }
            try {
                await axiosInstance.put('/api/myaccount/reset-password', {
                    currentPassword,
                    newPassword,
                    confirmPassword
                });
                passwordChanged = true;
            } catch (error) {
                console.error("비밀번호 변경 실패:", error);
                showToast("현재 비밀번호가 틀렸거나 오류가 발생했습니다.", "error");
                return; // 비밀번호 실패 시 프로필 수정 중단
            }
        }

        // --- 3. 프로필 정보 수정 로직 (참조: PUT /api/myaccount) ---
        try {
            await axiosInstance.put('/api/myaccount', {
                nickname: profile.nickname,
                username: profile.username,
                birthDate: profile.birthDate, // "YYYY-MM-DD" 형식 자동 맞춤
                gender: profile.gender        // "MALE" or "FEMALE"
            });
        } catch (error) {
            console.error("프로필 정보 수정 실패:", error);
            showToast("프로필 정보 수정 중 오류가 발생했습니다.", "error");
            return;
        }

        // --- 4. 결과 알림 및 이동 ---
        if (passwordChanged) {
            showToast("비밀번호와 회원정보가 수정되었습니다.", "success");
        } else {
            showToast("회원정보가 수정되었습니다.", "success");
        }
        navigate('/main'); // 혹은 마이페이지 메인으로 이동
    };
    
    // --- 회원 탈퇴 기능 ---
    const handleDeactivate = async () => {
        if (window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            try {
                await axiosInstance.delete('/api/myaccount/deactivate');
                showToast("회원 탈퇴가 완료되었습니다.", "info");
                
                // 로컬 스토리지 정리 및 로그인 페이지로 이동
                localStorage.clear(); 
                navigate('/login');
            } catch (error) {
                console.error("회원 탈퇴 실패:", error);
                showToast("회원 탈퇴 처리에 실패했습니다.", "error");
            }
        }
    };

    return (
        <div className="modify-page">
            <div className="form-card">
                <h1 className="title">내 정보 수정</h1>
                
                {/* 프로필 이미지 영역 */}
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
                        <input type="email" value={profile.email} disabled className="input-disabled" />
                    </div>
                    
                    {/* 닉네임 입력 + 중복 확인 버튼 */}
                    <div className="input-group">
                        <label htmlFor="nickname">닉네임</label>
                        <div className="nickname-check-group" style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                id="nickname" 
                                name="nickname" 
                                type="text" 
                                value={profile.nickname} 
                                onChange={handleProfileChange} 
                                style={{ flex: 1 }}
                            />
                            <button 
                                type="button" 
                                onClick={handleCheckNickname}
                                className="check-btn"
                                style={{ 
                                    padding: '0 15px', 
                                    backgroundColor: isNicknameChecked ? '#28a745' : '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {isNicknameChecked ? "확인완료" : "중복확인"}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">사용자 이름</label>
                        <input id="username" name="username" type="text" value={profile.username} onChange={handleProfileChange} />
                    </div>

                    {/* 성별 선택 */}
                    <div className="input-group">
                        <label>성별</label>
                        <div className="gender-select">
                            <button 
                                type="button" 
                                className={`gender-btn ${profile.gender === 'MALE' ? 'active' : ''}`}
                                onClick={() => setProfile({...profile, gender: 'MALE'})}>
                                남성
                            </button>
                            <button 
                                type="button" 
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
                        <input id="currentPassword" name="currentPassword" type="password" value={passwords.currentPassword} placeholder="변경하려면 입력하세요" onChange={handlePasswordChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <input id="newPassword" name="newPassword" type="password" value={passwords.newPassword} placeholder="새 비밀번호 (8자 이상)" onChange={handlePasswordChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" value={passwords.confirmPassword} placeholder="새 비밀번호 다시 입력" onChange={handlePasswordChange} />
                    </div>
                </div>

                <div className="button-group">
                    <button className="cancel-btn" onClick={() => navigate(-1)}>취소</button>
                    <button className="save-btn" onClick={handleUpdate}>수정하기</button>
                </div>
                
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
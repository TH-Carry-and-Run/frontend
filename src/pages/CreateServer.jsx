// CreateServer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../components/styles/CreateServer.css';
import ServerLoading from "../components/Server/ServerLoading";
import CreateServerForm from "../components/Server/CreateServerForm";
import axiosInstance from '../utils/axiosInstance';

const CreateServer = ({ showToast }) => {
    
    const navigate = useNavigate();
    const [serverName, setServerName] = useState("");
    const [os, setOs] = useState("Ubuntu");
    const [version, setVersion] = useState("");
    const [showVersionOptions, setShowVersionOptions] = useState(false);
    // const [ttl, setTtl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successUrl, setSuccessUrl] = useState(null); // 서버 성공시 저장할 preSignedUrl

    const handleCreate = async () => {
        if (!serverName) {
            showToast("서버 이름을 입력해주세요.");
            return;
        }
        if (!version) {
            showToast("운영체제 버전을 선택해주세요.");
            return;
        }
        // if (!ttl) {
        //     showToast("TTL을 선택해주세요.");
        //     return;
        // }

        const payload = {
            os: os,
            version: version,
            // ttl
        };
        
        setIsLoading(true); // 로딩 화면 표시

        try {
            const response = await axiosInstance.post("/api/container/create", payload);
            console.log("서버 생성 성공:", response.data);
            showToast("서버가 성공적으로 생성되었습니다!");
            navigate("/server-page");

            // 단일 URL일 수도, 여러 개일 수도 있으니 둘 다 대응
            // const urls = response.data?.presignedUrls || response.data?.presignedUrl
            //     ? (Array.isArray(response.data.presignedUrls) ? response.data.presignedUrls : [response.data.presignedUrl])
            //     : [];


            let urls = [];
            if (Array.isArray(response.data?.presignedUrls)) {
                urls = response.data.presignedUrls;
            } else if (response.data?.presignedUrl) {
                urls = [response.data.presignedUrl];
            }
            

            if (urls.length > 0) {
                showToast("서버가 성공적으로 생성되었습니다!");
                // 각각 새 창(탭)으로 띄우기
                urls.forEach(url => {
                    window.open(url, "_blank");
                });
                // 서버 리스트로 이동
                setTimeout(() => navigate("/serverpage"), 1500);
            } else {
                showToast("presigned URL을 받지 못했습니다.");
            }
        } catch (error) {
            console.error("서버 생성 실패:", error);
            showToast("서버 생성 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/ServerPage");
    };

    if (isLoading && !successUrl) {
      return <ServerLoading />;
  }

  if (successUrl) {
      return <CreateServerForm preSignedUrl={successUrl} />;
  }


    return (
        <div className="create-server-container">
            <h1 className="title">서버 생성</h1>

            {/* 서버 이름 입력 */}
            <div className="section-box">
                <div className="input-box">
                    <label>서버 이름</label>
                    <input
                        type="text"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        placeholder="서버 이름을 입력하세요"
                    />
                </div>
            </div>

            {/* OS 및 버전 선택 */}
            <div className="section-box">
                <div className="input-box">
                    <label>운영 체제 및 버전</label>
                    <div className="os-selector">
                        <span>Ubuntu</span>
                        <div
                            className="version-dropdown"
                            onClick={() => setShowVersionOptions(!showVersionOptions)}
                        >
                            {version || "버전 선택"}
                            <div className={`options ${showVersionOptions ? "show" : ""}`}>
                                {["20.04", "22.04"].map((v) => (
                                    <div
                                        key={v}
                                        onClick={() => {
                                            setVersion(v);
                                            setShowVersionOptions(false);
                                        }}
                                    >
                                        {v}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TTL 설정 */}
            {/* <div className="section-box">
                <div className="input-box">
                    <label>TTL 설정</label>
                    <select value={ttl} onChange={(e) => setTtl(e.target.value)}>
                        <option value="">TTL을 선택하세요</option>
                        <option value="1시간">1시간</option>
                        <option value="2시간">2시간</option>
                        <option value="6시간">6시간</option>
                        <option value="24시간">24시간</option>
                    </select>
                </div>
            </div> */}

            {/* 버튼 */}
            <div className="button-group">
                <button className="create-btn" onClick={handleCreate}>Create</button>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};


export default CreateServer;
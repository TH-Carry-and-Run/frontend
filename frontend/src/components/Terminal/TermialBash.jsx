import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from 'xterm-addon-fit';
import axios from 'axios';
import './TerminalOverlay.css';
import { toast } from 'react-toastify';

const TerminalComponent = () => {
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const term = useRef(null);
    const fitAddon = useRef(new FitAddon());
    const [showOverlay, setShowOverlay] = useState(false);

    const handleClose = () => {
        window.open('', '_self');
        window.close();
    
        // 팝업/탭이 닫히지 않을 경우 대비
        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    };

    useEffect(() => {
        console.log("✅ useEffect 실행됨");  // 이거 추가
        // Terminal + FitAddon 초기화
        term.current = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            rows: 40,
            cols: 120,
        });
        term.current.loadAddon(fitAddon.current);
        term.current.open(terminalRef.current);

        // ✨ 화면 사이즈 맞춤 (오류 방지용으로 raf 안에 넣음)
        requestAnimationFrame(() => {
            fitAddon.current.fit();
        });

        // 사용자 입력 → WebSocket
        term.current.onData(data => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                const fixedData = data === '\r' || data === '\n' ? '\r' : data;  // ← 핵심
                socketRef.current.send(fixedData);
                console.log("SEND:", JSON.stringify(fixedData));
            }
        });

        // Presigned WebSocket URL 요청
        axios.get('http://localhost:8080/api/access/presigned/validate', {
            params: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZXlfbWluakBuYXZlci5jb20iLCJwb2ROYW1lIjoicG9kLTVmMTY0MDcxIiwicG9kTmFtZXNwYWNlIjoiZGVmYXVsdCIsImluZ3Jlc3MiOiJ0Y2FyLmFkbWluLmNvbm5lY3Rpb24uY29tL2RlZmF1bHQvcG9kLTVmMTY0MDcxIn0.jsD1PPh5YKxTTkRdb01Usa19efw5awJvhUK2-bXCias',
                // token: "test",
                podName: 'pod-5f164071',
                podNamespace: 'default'
            }
        }).then(response => {
            const wsUrl = response.data.replace('ws://127.0.0.1', 'ws://127.0.0.1:8080');
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => {
                term.current.write('\r\n[+] Connected to your pod\r\n');
            };

            socketRef.current.onmessage = event => {
                // 1. JSON 파싱
                let msgObj;
                try {
                    msgObj = JSON.parse(event.data);
                } catch(e) {
                    // 혹시 서버에서 JSON이 아닌 메시지가 올 수도 있으니, fallback
                    console.log("RECV(Non-JSON):", event.data);
                    term.current.write(event.data);
                    return;
                }
            
                console.log("RECV(JSON):", msgObj);
            
                // 2. 타입별 처리
                if(msgObj.type === "INPUT") {
                    // \n만 있는 줄바꿈을 \r\n으로 보정
                    let output = msgObj.message.replace(/\n(?!\r)/g, '\n\r');
                    term.current.write(output);
                } else if(msgObj.type === "NOTICE" || msgObj.type === "notice") {
                    let output = msgObj.message.replace(/\n(?!\r)/g, '\n\r');
                    toast.info(output);  // ← 여기만 바꿔줌!
                } else if(msgObj.type === "WARNING" || msgObj.type === "warning") {
                    let output = msgObj.message.replace(/\n(?!\r)/g, '\n\r');
                    toast.warn(output);
                } else {
                    // 기타 타입: 필요시 확장
                    console.log("알 수 없는 메시지 타입:", msgObj);
                }
            };
            
            

            socketRef.current.onclose = () => {
                term.current.write('\r\n[+] Connection closed.\r\n');
            };
        }).catch(error => {
            console.error("접속 실패:", error);
            setShowOverlay(true); // ✅ 실패 시 오버레이 띄움
        });

        return () => {
            term.current?.dispose();
            socketRef.current?.close();
        };
    }, []);


    return (
        <>
            <div ref={terminalRef} style={{ height: '500px', width: '100%', backgroundColor: 'black' }} />
            {showOverlay && (
                <div className="overlay">
                    <div className="modal">
                    <h2>접근할 수 없습니다</h2>
                    <button onClick={handleClose}>나가기</button>
                    </div>
                </div>
                )}
        </>
    );
};

export default TerminalComponent;
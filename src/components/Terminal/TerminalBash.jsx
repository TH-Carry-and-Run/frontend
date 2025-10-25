import React, { useEffect, useRef } from 'react';
import { Terminal } from "@xterm/xterm"; 
import "@xterm/xterm/css/xterm.css";     
import { FitAddon } from 'xterm-addon-fit'; 
import axiosInstance from '../../utils/axiosInstance'; 
import './TerminalBash.css';

// props는 받지만 임시 테스트 중에는 사용하지 않음
const TerminalBash = ({ showToast, presignedUrl, podName, podNamespace }) => { 
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const term = useRef(null);
    const fitAddon = new FitAddon();

    useEffect(() => {
        if (term.current) return; 

        term.current = new Terminal({  });
        term.current.loadAddon(fitAddon);
        term.current.open(terminalRef.current);
        
        const fitTerminal = () => { try { fitAddon.fit(); } catch(e) {} };
        fitTerminal();
        window.addEventListener('resize', fitTerminal);

        // --- 2. 터미널 입력 -> 웹소켓 전송 설정 (기존과 동일) ---
        term.current.onData(data => { /* ... */ });

        // --- 3. VM API에 웹소켓 주소 요청 (임시 값) ---
        const connectWebSocket = async () => {
            // 필수 props 검사는 임시 테스트 중에는 주석 처리/제거 가능
            // if (!presignedUrl || !podName || !podNamespace) { ... }

            try {
                // --- 임시 값으로 API 호출 ---
                const response = await axiosInstance.get('/api/access/presigned/validate', {
                    params: {
                        token: 'eyJzdWIiOiJoZXlfbWluakBuYXZlci5jb20iLCJwb2ROYW1lIjoicG9kLTM5ZTMwNzlmIiwicG9kTmFtZXNwYWNlIjoiZGVmYXVsdCIsImluZ3Jlc3MiOiJ0Y2FyLmFkbWluLmNvbm5lY3Rpb24uY29tL2RlZmF1bHQvcG9kLTM5ZTMwNzlmIn0', // 임시 토큰
                        podName: 'pod-39e3079f',   // 임시 podName
                        podNamespace: 'default' // 임시 podNamespace
                    }
                });

                const wsUrl = response.data; 
                 if (!wsUrl || !(wsUrl.startsWith('ws://') || wsUrl.startsWith('wss://'))) {
                    throw new Error('Invalid WebSocket URL received from server.');
                }

                // --- 4. 실제 웹소켓 연결 시도 (기존과 동일) ---
                socketRef.current = new WebSocket(wsUrl);
                socketRef.current.onopen = () => { /* ... */ };
                socketRef.current.onmessage = event => { /* ... */ };
                socketRef.current.onclose = () => { /* ... */ };
                socketRef.current.onerror = (error) => { /* ... */ };

            } catch (error) {
                console.error("VM API 요청 실패 또는 웹소켓 주소 검증 실패:", error);
                const errorMsg = error.response?.data?.message || "터미널 접속 정보를 가져오는 데 실패했습니다.";
                showToast(errorMsg, 'error');
                if (term.current) {
                    term.current.write(`\r\n\x1b[31m[!] Error: Failed to validate access or get WebSocket URL.\x1b[0m`);
                    term.current.write(`\r\n\x1b[33m[?] ${errorMsg}\x1b[0m\r\n`);
                }
            }
        };

        connectWebSocket(); // 웹소켓 연결 함수 실행

        // 컴포넌트 언마운트 시 정리 함수
        return () => {
            window.removeEventListener('resize', fitTerminal);
            term.current?.dispose(); 
            socketRef.current?.close(); 
        };
    // props를 사용하지 않으므로 의존성 배열에서 제거 (showToast는 유지)
    }, [showToast]); 

    return (
        <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
    );
};

export default TerminalBash;
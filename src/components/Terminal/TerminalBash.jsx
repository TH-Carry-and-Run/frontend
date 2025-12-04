import React, { useEffect, useRef } from 'react';
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from 'xterm-addon-fit';
import axios from 'axios';
// import { VM_URL } from '../../config'; // presignedUrl을 직접 쓰면 VM_URL import도 필요 없습니다.
import './TerminalBash.css';

const TerminalBash = ({ showToast, presignedUrl, podName, podNamespace }) => {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  const termRef = useRef(null);
  const fitAddon = useRef(new FitAddon());

  // ❌ [삭제] 하드코딩된 상수들은 이제 필요 없습니다.
  // const TOKEN = '...'; 
  // const POD_NAME = '...';
  // const POD_NAMESPACE = '...';

  useEffect(() => {
    // presignedUrl이 없으면 실행하지 않음 (방어 코드)
    if (!presignedUrl) return;

    let isMounted = true;
    let resizeListener = null;
    let initialFitTimer = null;

    // 1) xterm 초기화
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Fira Code, monospace',
      theme: {
        background: '#1e1e2e',
        foreground: '#cdd6f4',
        cursor: '#f5e0dc',
        selectionBackground: '#585b70',
      },
      scrollback: 1000,
    });
    termRef.current = term;
    term.loadAddon(fitAddon.current);

    requestAnimationFrame(() => {
      if (!isMounted || !terminalRef.current) return;
      term.open(terminalRef.current);
      
      const fit = () => {
        if (!isMounted) return;
        try {
          requestAnimationFrame(() => fitAddon.current.fit());
        } catch {}
      };
      initialFitTimer = setTimeout(fit, 100);
      resizeListener = fit;
      window.addEventListener('resize', resizeListener);

      // 키 입력 → WS 전송
      term.onData((data) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          // 엔터 처리 보정
          const out = (data === '\n' || data === '\r') ? '\r' : data;
          socketRef.current.send(out);
        }
      });

      // 2) 웹소켓 연결 시작 (props로 받은 URL 사용)
      connectWebSocket(term, presignedUrl);
    });

    const connectWebSocket = async (termInstance, urlToValidate) => {
      try {
        // ✨ [핵심 수정] 
        // 기존: axios.get(VM_URL + '...', { params: { token: TOKEN ... } })
        // 수정: 백엔드가 준 전체 URL(토큰 포함됨)을 그대로 호출
        const res = await axios.get(urlToValidate);

        // 응답 처리
        const raw = res.data;
        let wsUrl =
          (typeof raw === 'string' && raw) ||
          raw?.wsUrl ||
          raw?.url;

        if (!wsUrl) {
          throw new Error('검증 응답에 WebSocket URL이 없습니다.');
        }

        // http(s) -> ws(s) 프로토콜 변환
        if (wsUrl.startsWith('http://')) wsUrl = wsUrl.replace('http://', 'ws://');
        if (wsUrl.startsWith('https://')) wsUrl = wsUrl.replace('https://', 'wss://');

        // WebSocket 연결
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          termInstance.write('\r\n\x1b[32m[+] Connected to your pod\x1b[0m\r\n');
          requestAnimationFrame(() => fitAddon.current.fit());
          showToast?.('터미널 연결 성공', 'success');
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const obj = JSON.parse(event.data);
            const write = (msg) => termInstance.write(String(msg).replace(/\n(?!\r)/g, '\n\r'));
            switch ((obj.type || '').toUpperCase()) {
              case 'INPUT':
                write(obj.message ?? '');
                break;
              case 'NOTICE':
                write(obj.message ?? '');
                showToast?.(obj.message ?? '', 'info');
                break;
              case 'WARNING':
                write(obj.message ?? '');
                showToast?.(obj.message ?? '', 'warning');
                break;
              default:
                write(obj.message ?? '');
            }
          } catch {
            // 일반 텍스트 처리
            termInstance.write(String(event.data).replace(/\n(?!\r)/g, '\n\r'));
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          termInstance.write('\r\n\x1b[33m[+] Connection closed.\x1b[0m\r\n');
        };

        ws.onerror = (e) => {
          if (!isMounted) return;
          console.error('[WS ERROR]', e);
          showToast?.('웹소켓 오류가 발생했습니다.', 'error');
          termInstance.write('\r\n\x1b[31m[!] WebSocket error\x1b[0m\r\n');
        };
      } catch (err) {
        console.error('[VALIDATE ERROR]', err);
        showToast?.('터미널 접속 정보를 가져오지 못했습니다.', 'error');
        termInstance.write('\r\n\x1b[31m[!] Failed to get WebSocket URL\x1b[0m\r\n');
      }
    };

    // 3) 정리 (Cleanup)
    return () => {
      isMounted = false;
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (initialFitTimer) clearTimeout(initialFitTimer);
      termRef.current?.dispose();
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null;
      termRef.current = null;
    };
  }, [presignedUrl]); // presignedUrl이 바뀔 때만 재실행

  return (
    <div
      ref={terminalRef}
      className="terminal-bash-container" 
      style={{ height: '100%', width: '100%' }}
    />
  );  
};

export default TerminalBash;
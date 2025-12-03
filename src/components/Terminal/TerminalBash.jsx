import React, { useEffect, useRef } from 'react';
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from 'xterm-addon-fit';
import axios from 'axios';
import { VM_URL } from '../../config';
import './TerminalBash.css';

// props는 그대로 받되, 지금은 테스트 편의를 위해 내부 상수 사용
const TerminalBash = ({ showToast, presignedUrl, podName, podNamespace }) => {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  const termRef = useRef(null);
  const fitAddon = useRef(new FitAddon());

  const TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicG9kTmFtZSI6InBvZC05MmY5ZGNmYSIsInBvZE5hbWVzcGFjZSI6ImRlZmF1bHQiLCJpbmdyZXNzIjoidGNhci5hZG1pbi5jb25uZWN0aW9uLmNvbS9kZWZhdWx0L3BvZC05MmY5ZGNmYSJ9.XAITeBWU3txa9_YQFzNioYAjdACA977SMux65MePWbM';
  const POD_NAME = 'pod-92f9dcfa';
  const POD_NAMESPACE = 'default';

  // const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicG9kTmFtZSI6InBvZC0zNGFjNzliOSIsInBvZE5hbWVzcGFjZSI6ImRlZmF1bHQiLCJpbmdyZXNzIjoidGNhci5hZG1pbi5jb25uZWN0aW9uLmNvbS9kZWZhdWx0L3BvZC0zNGFjNzliOSIsImlhdCI6MTc2MTU3NDYyNywiZXhwIjoxNzYxNTc0OTI3fQ.g7jamWQGICjMOKVEZqrS_GsOHRXGiGmVXkp-p8hUwsY';
  // const POD_NAME = 'pod-34ac79b9';
  // const POD_NAMESPACE = 'default';

  useEffect(() => {
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

      // 키 입력 → WS
      term.onData((data) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          // 엔터 정규화(환경 따라 \n만 들어오는 경우 보정)
          const out = (data === '\n' || data === '\r') ? '\r' : data;
          socketRef.current.send(out);
        }
      });

      // 2) presigned 검증 → WS URL 획득 → 연결
      connectWebSocket(term);
    });

    const connectWebSocket = async (termInstance) => {
      try {
        const validateUrl = `${VM_URL}/api/access/presigned/validate`;
        const res = await axios.get(validateUrl, {
          params: {
            token: TOKEN,
            podName: POD_NAME,
            podNamespace: POD_NAMESPACE,
          },
        });

        // 백엔드가 문자열 또는 {wsUrl|url}로 줄 수 있음
        const raw = res.data;
        let wsUrl =
          (typeof raw === 'string' && raw) ||
          raw?.wsUrl ||
          raw?.url;

        if (!wsUrl) {
          throw new Error('검증 응답에 WebSocket URL이 없습니다.');
        }

        // http(s) → ws(s) 안전 변경
        if (wsUrl.startsWith('http://')) wsUrl = wsUrl.replace('http://', 'ws://');
        if (wsUrl.startsWith('https://')) wsUrl = wsUrl.replace('https://', 'wss://');

        // 실제 연결
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
            // 순수 텍스트
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

    // 3) 정리
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
  }, []);

  return (
    <div
      ref={terminalRef}
      className="terminal-bash-container" 
      style={{ height: '100%', width: '100%' }}
    />
  );  
};
export default TerminalBash;
// config.js
export const BACKEND_IP = process.env.REACT_APP_BACKEND_IP;
export const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT;

export const VM_IP = process.env.REACT_APP_VM_IP;
export const VM_PORT = process.env.REACT_APP_VM_PORT;

// 실제 API_BASE_URL 만들기!
export const BACKEND_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`;
export const VM_URL = `http://${VM_IP}:${VM_PORT}`;
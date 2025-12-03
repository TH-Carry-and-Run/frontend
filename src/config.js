// // config.js
export const BACKEND_IP = process.env.REACT_APP_BACKEND_IP;
export const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT;

export const VM_IP = process.env.REACT_APP_VM_IP;
export const VM_PORT = process.env.REACT_APP_VM_PORT;
export const VM_URL = `http://${VM_IP}:${VM_PORT}`;


// src/config.js
// export const BACKEND_IP = process.env.REACT_APP_BACKEND_IP || "43.200.201.172";
// export const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "8080";
export const BACKEND_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`;
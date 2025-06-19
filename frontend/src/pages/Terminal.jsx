// src/component/terminal/Terminal.js
import React from "react";
import TerminalBash from "./TerminalBash";
import TerminalStatus from "./TerminalStatus";

const Terminal = () => {
    return (
        <div>
            <h2>🔧 사용자의 가상머신 CLI</h2>
            <TerminalBash />
            <TerminalStatus />
        </div>
        );
    };

export default Terminal;
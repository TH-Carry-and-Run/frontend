// src/components/User/UserTierBadge.jsx
import React from "react";
import "./UserTierBadge.css";

const UserTierBadge = ({ tier, maxServerCount, currentServerCount }) => {
  if (!tier) return null;

  const upper = tier.toUpperCase();
  const labelMap = {
    BASIC: "BASIC",
    PRO: "PRO",
    ENTERPRISE: "ENTERPRISE",
    ADMIN: "ADMIN",
  };
  const label = labelMap[upper] || upper;

  const isUnlimited = maxServerCount === -1;
  const hasUsage =
    typeof currentServerCount === "number" &&
    (typeof maxServerCount === "number" || isUnlimited);

  return (
    <div className="tier-badge-wrapper">
      <span className={`tier-badge tier-${upper.toLowerCase()}`}>
        {label}
      </span>

      {hasUsage && (
        <span className="tier-usage">
          {isUnlimited
            ? `현재 생성된 서버: ${currentServerCount}개 (무제한 티어)`
            : `현재 생성된 서버: ${currentServerCount}/${maxServerCount}개`}
        </span>
      )}
    </div>
  );
};

export default UserTierBadge;
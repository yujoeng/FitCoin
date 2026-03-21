"use client";

import React from "react";
import { X } from "lucide-react";
import { useBgm } from "@/hooks/useBgm";

interface SettingModalProps {
  onClose: () => void;
}

/**
 * 환경 설정 모달 컴포넌트
 * BGM, 알림, 언어 설정을 제공한다.
 */
export default function SettingModal({ onClose }: SettingModalProps) {
  const {
    isEnabled,
    volume,
    notificationsEnabled,
    toggleBgm,
    changeVolume,
    toggleNotifications,
  } = useBgm();

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        // index.css의 fc-fadeIn 애니메이션 활용
        animation: "fc-fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "320px",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          boxShadow: "0 20px 60px rgba(44, 62, 31, 15%)",
          background: "var(--color-bg-card)",
          // index.css의 fc-popIn 애니메이션 활용
          animation: "fc-popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-6)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              margin: 0,
              letterSpacing: "-0.01em",
              textTransform: "lowercase",
              fontFamily: "var(--font-body)",
            }}
          >
            setting
          </h2>
          <button
            onClick={onClose}
            className="fc-pressable"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-secondary)",
              background: "rgba(44, 62, 31, 0.05)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 설정 리스트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {/* 음악 ON / OFF */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
              음악 ON / OFF
            </span>
            <button
              onClick={toggleBgm}
              className="fc-pressable"
              style={{
                width: "44px",
                height: "22px",
                borderRadius: "var(--radius-full)",
                background: isEnabled ? "var(--color-primary)" : "#E2E8F0",
                position: "relative",
                transition: "background 0.2s ease",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "3px",
                  left: isEnabled ? "25px" : "3px",
                  transition: "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            </button>
          </div>

          {/* 볼륨 조절 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                볼륨
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                {Math.round(volume * 100)}
              </span>
            </div>
            <div style={{ position: "relative", width: "100%", height: "20px", display: "flex", alignItems: "center" }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "var(--radius-full)",
                  appearance: "none",
                  background: `linear-gradient(to right, var(--color-primary) ${volume * 100}%, #E2E8F0 ${volume * 100}%)`,
                  outline: "none",
                  cursor: "pointer",
                }}
              />
              <style>{`
                input[type=range]::-webkit-slider-thumb {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: white;
                  border: 2px solid var(--color-primary);
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                input[type=range]::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  background: white;
                  border: 2px solid var(--color-primary);
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  border: 2px solid var(--color-primary);
                }
              `}</style>
            </div>
          </div>

          {/* 알림 설정 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
              알림 설정
            </span>
            <button
              onClick={toggleNotifications}
              className="fc-pressable"
              style={{
                width: "44px",
                height: "22px",
                borderRadius: "var(--radius-full)",
                background: notificationsEnabled ? "var(--color-primary)" : "#E2E8F0",
                position: "relative",
                transition: "background 0.2s ease",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "3px",
                  left: notificationsEnabled ? "25px" : "3px",
                  transition: "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            </button>
          </div>

          {/* 언어 설정 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
              언어 설정
            </span>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>
              한국어
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import BaseModal from "@/components/common/BaseModal";

interface AdAlreadyWatchedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdAlreadyWatchedModal: React.FC<AdAlreadyWatchedModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal isOpen={isOpen}>
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            marginBottom: "8px",
          }}
        >
          <Image
            src="/noad.png"
            alt="시청 가능한 광고가 없어요"
            fill
            sizes="(max-width: 320px) 100vw, 320px"
            style={{ objectFit: "contain" }}
            priority
            onError={(e) => {
              e.currentTarget.src = "/icons/error.png";
            }}
          />
        </div>
        <h3
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: "8px",
          }}
        >
          이미 시청하셨어요
        </h3>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            marginBottom: "24px",
            lineHeight: 1.5,
          }}
        >
          오늘은 이미 시청 가능한 광고를 다 봤습니다.
          <br />
          내일 다시 만나요!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={onClose}
            className="fc-pressable"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-inverse)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            확인
          </button>

          {/* 테스트 도우미: 로컬 스토리지 초기화 */}
          <button
            onClick={() => {
              localStorage.removeItem("fitcoin_ad_watched_today");
              window.location.reload();
            }}
            style={{
              fontSize: "10px",
              color: "var(--color-text-secondary)",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginTop: "4px",
            }}
          >
            {/* [테스트용] 시청 기록 초기화 */}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default AdAlreadyWatchedModal;

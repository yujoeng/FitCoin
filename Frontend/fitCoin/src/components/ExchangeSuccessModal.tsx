"use client";

import Image from "next/image";
import BaseModal from "@/components/common/BaseModal";

interface ExchangeSuccessModalProps {
  isOpen: boolean;
  receivedCoin: number;
  onClose: () => void;
}

export default function ExchangeSuccessModal({
  isOpen,
  receivedCoin,
  onClose,
}: ExchangeSuccessModalProps) {
  return (
    <BaseModal isOpen={isOpen}>
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          minWidth: "260px",
          textAlign: "center",
        }}
      >
        {/* 캐릭터 이미지 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "260px",
            marginBottom: "8px",
          }}
        >
          <Image
            src="/exchangeSuccess.png"
            alt="환전 완료"
            fill
            sizes="(max-width: 320px) 100vw, 320px"
            style={{ objectFit: "contain" }}
            priority
            onError={(e) => {
              e.currentTarget.src = "/icons/error.png";
            }}
          />
        </div>

        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            marginBottom: "4px",
            lineHeight: 1.5,
          }}
        >
          코인으로 교환됐어요
        </p>

        <p
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-primary)",
            marginBottom: "24px",
          }}
        >
          +{receivedCoin.toLocaleString("ko-KR")} C
        </p>

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
      </div>
    </BaseModal>
  );
}

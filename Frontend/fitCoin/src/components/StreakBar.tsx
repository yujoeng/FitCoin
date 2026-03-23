import Image from "next/image";
import type { StreakDay, StreakDayStatus } from "@/types/home";

interface StreakBarProps {
  /** 연속 스트릭 일수 */
  streakCount: number;
  /** 최근 7일 스트릭 배열 (왼쪽=오래된 날, 오른쪽=오늘) */
  streakDays: StreakDay[];
  /** 전체 달력 보기 클릭 콜백 */
  onViewCalendar?: () => void;
}

// ─── 상태별 스타일 ───
const STATUS_STYLE: Record<
  StreakDayStatus,
  {
    bg: string;
    border: string;
    color: string;
    icon?: React.ReactNode;
  }
> = {
  done: {
    bg: "var(--color-primary)",
    border: "var(--color-bg-dark)",
    color: "#fff",
    icon: (
      <Image
        src="/icons/streak.png"
        alt="완료"
        width={18}
        height={18}
        style={{ objectFit: "contain" }}
        priority
        onError={(e) => {
          e.currentTarget.src = "/icons/error.png";
        }}
      />
    ),
  },
  missed: {
    bg: "transparent",
    border: "transparent",
    color: "var(--color-text-primary)",
  },
  today: {
    bg: "transparent",
    border: "var(--color-primary)",
    color: "var(--color-text-primary)",
  },
  future: {
    bg: "transparent",
    border: "transparent",
    color: "var(--color-text-primary)",
  },
};

export default function StreakBar({
  streakCount,
  streakDays,
  onViewCalendar,
}: StreakBarProps) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-3) var(--space-4)",
        background: "var(--color-primary-light)",
      }}
    >
      {/* 상단: 연속 일수 + 화살표 */}
      <button
        onClick={onViewCalendar}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="전체 달력 보기"
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <Image
            src="/icons/streak.png"
            alt="스트릭"
            width={18}
            height={18}
            style={{ objectFit: "contain" }}
            priority
            onError={(e) => {
              e.currentTarget.src = "/icons/error.png";
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            연속 학습{" "}
            <span style={{ color: "var(--color-bg-dark)" }}>
              {streakCount}일
            </span>
          </span>
        </span>
        <span style={{ color: "var(--color-text-disabled)", fontSize: "16px" }}>
          ›
        </span>
      </button>

      {/* 7일 dot 행 */}
      <div
        style={{
          marginTop: "var(--space-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-1)",
        }}
      >
        {streakDays.map((day, idx) => {
          const style = STATUS_STYLE[day.status];
          const isToday = day.status === "today";

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-1)",
              }}
            >
              {/* 요일 라벨 */}
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: isToday
                    ? "var(--color-primary-dark)"
                    : "var(--color-text-secondary)",
                  fontWeight: isToday ? 700 : 500,
                  fontFamily: "var(--font-body)",
                }}
              >
                {day.label}
              </span>

              {/* 원형 상태 뱃지 */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--radius-full)",
                  background: style.bg,
                  border: `2px solid ${style.border}`,
                  color: style.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  boxShadow: isToday
                    ? "0 0 0 2px rgba(150,185,91,0.35)"
                    : "none",
                }}
              >
                {day.status === "done" ? style.icon : idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* 오늘 표시 삼각형 */}
      <div
        style={{
          marginTop: "2px",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-1)",
        }}
      >
        {streakDays.map((day, idx) => (
          <div
            key={idx}
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            {day.status === "today" && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderBottom: "5px solid var(--color-primary-dark)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

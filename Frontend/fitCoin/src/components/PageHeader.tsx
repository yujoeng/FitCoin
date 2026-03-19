// 페이지 상단에 사용하는 공통 헤더 컴포넌트 (뒤로가기 버튼 + 타이틀)

import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="뒤로가기"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            color: 'var(--color-text-primary)',
          }}
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <h1
        style={{
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--color-text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h1>
    </header>
  );
}

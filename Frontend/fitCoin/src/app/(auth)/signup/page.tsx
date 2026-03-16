'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SignupForm from '@/features/auth/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: '#FFF8E7',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>

      {/* 뒤로가기 — 독립적으로 고정 */}
      <button
        type="button"
        onClick={() => router.back()}
        style={{
          position: 'absolute',
          top: '16px',
          left: '24px',
          background: 'none',
          border: 'none',
          color: '#2C3E1F',
          fontSize: '22px',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1,
          zIndex: 10,
        }}
      >
        {'<'}
      </button>

      {/* 로고 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '60px',
        flexShrink: 0,
      }}>
        <Image
          src="/logo.png"
          alt="FITCOIN 로고"
          width={140}
          height={50}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* 회원가입 폼 */}
      <div style={{
        flex: 1,
        padding: '8px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <SignupForm />
      </div>

    </div>
  );
}
// 이 파일이 하는 일: 뒤로가기(고정) + 로고 + SignupForm을 화면에 배치한다.

// 현재: props로 받은 points/coins 표시, 마운트 시 상점 아이템 목록 조회
// TODO: 백엔드 API 연결 후 points/coins 는 전역 상태에서 주입


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGacha from '@/features/store/hooks/useGacha';
import { getStoreInfo } from '@/features/store/services/storeApi';
import StoreGachaSection from '@/features/store/components/StoreGachaSection';
import GachaResultModal from '@/features/store/components/GachaResultModal';
import StoreThemePreview from '@/features/store/components/StoreThemePreview';
import PageHeader from '@/components/PageHeader';
import type { StoreItem } from '@/features/store/types/types';
import type { UserCharacter } from '@/types/home';
import PointBadge from '@/components/PointBadge';
import CoinBadge from '@/components/CoinBadge';

interface StoreViewProps {
    points: number;
    coins: number;
    character: UserCharacter | null;
}

export default function StoreView({ points, coins, character }: StoreViewProps) {
    const router = useRouter();
    const { isLoading, result, error, executeGacha, clearResult } = useGacha();

    // ─── 상점 아이템 목록 ───
    const [items, setItems] = useState<StoreItem[]>([]);

    // 마운트 시 1회 아이템 목록 조회
    // TODO: 백엔드 API 연결 후 에러 처리 UI 추가
    useEffect(() => {
        getStoreInfo()
            .then((res) => {
                if (res.isSuccess && res.result) {
                    setItems(res.result.items);
                }
            })
            .catch(() => {
                // 조용히 실패 처리 — 가격 표시만 안 됨
            });
    }, []);

    const isModalOpen = result !== null || error !== null;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-bg)',
                height: '100%',
            }}>
            {/* 페이지 헤더 + 포인트/코인 한 줄 배치 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px 8px 4px',
                    flexShrink: 0,
                    maxWidth: '430px',
                    width: '100%',
                    margin: '0 auto',
                }}
            >
                {/* 좌측: 페이지 타이틀 + 뒤로가기 */}
                <PageHeader title="상점" onBack={() => router.back()} />

                {/* 우측: 포인트 / 코인 박스 */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {/* 포인트 */}
                    <PointBadge points={points} />

                    {/* 코인 */}
                    <CoinBadge coins={coins} />
                </div>
            </div>

            {/* 스크롤 콘텐츠 영역 */}
            <div
                className="fc-hide-scrollbar"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--color-bg)',
                    padding: '0 16px 0px 16px',
                    gap: '4px',
                    overflowY: 'auto',
                    flex: 1,
                    minHeight: 0,
                }}
            >

                {/* ── 중단: 테마 미리보기 ── */}
                <div
                    style={{
                        background: 'var(--color-bg-card)',
                        borderRadius: '16px',
                        padding: '8px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <StoreThemePreview character={character} style={{ flex: 1 }} />
                </div>

                {/* ── 하단: 뽑기 섹션 ── */}
                <div
                    style={{
                        background: 'var(--color-bg-card)',
                        borderRadius: '16px',
                        padding: '8px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                >
                    <StoreGachaSection
                        onGacha={executeGacha}
                        isLoading={isLoading}
                        items={items}
                    />
                </div>

                {/* ── 뽑기 결과 모달 ── */}
                <GachaResultModal
                    isOpen={isModalOpen}
                    result={result}
                    error={error}
                    onClose={clearResult}
                />
            </div>
        </div>
    );
}

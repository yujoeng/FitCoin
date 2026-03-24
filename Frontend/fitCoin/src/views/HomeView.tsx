'use client';

import { useRouter } from 'next/navigation';
import RoomView from '@/components/RoomView';
import AppImage from "@/shared/components/AppImage";
import StreakBar from '@/components/StreakBar';
import type { HomePageState } from '@/types/home';
import PointBadge from '@/components/PointBadge';
import CoinBadge from '@/components/CoinBadge';

interface CircleButtonProps {
    imageSrc: string;
    onClick: () => void;
    label: string;
}

function CircleButton({ imageSrc, onClick, label }: CircleButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className="fc-pressable"
            style={{
                width: '55px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px 0',
                gap: '2px',
            }}
        >
            <AppImage
                src={imageSrc}
                alt={label}
                style={{ width: '44px', height: '44px' }}
            />
            <span style={{
                fontSize: '9px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: 1,
            }}>
                {label}
            </span>
        </button>
    );
}
interface HomeViewProps {
    state: HomePageState;
    onGoMission: () => void;
    onEditRoom: () => void;
    onWatchAd: () => void;
    onGoExchange: () => void;
    onGoStore: () => void;
    onGoSettings: () => void;
    onViewCalendar: () => void;
    onGraduate: () => void;
}

export default function HomeView({
    state,
    onGoMission,
    onEditRoom,
    onWatchAd,
    onGoExchange,
    onGoStore,
    onGoSettings,
    onViewCalendar,
    onGraduate,
}: HomeViewProps) {
    const router = useRouter();
    const { points, coins, streakCount, streakDays, character, roomConfig } = state;
    const expPercent = character ? (character.exp / 10) * 100 : 0;

    return (
        <div
            className="fc-hide-scrollbar"
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-bg)',
                maxWidth: '430px',
                margin: '0 auto',
                width: '100%',
                height: '100%',
            }}
        >
            {/* ── 상단: 스트릭바 + 포인트/코인 ── */}
            <div
                style={{
                    position: 'relative',
                    padding: 'var(--space-3) var(--space-3) 0',
                    flexShrink: 0,
                }}
            >
                <div style={{ paddingRight: '105px' }}>
                    <StreakBar
                        streakCount={streakCount}
                        streakDays={streakDays}
                        onViewCalendar={onViewCalendar}
                    />
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: 'var(--space-3)',
                        right: 'var(--space-3)',
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-1)',
                    }}
                >
                    <PointBadge points={points} />
                    <CoinBadge coins={coins} />
                </div>
            </div>

            {/* ── 중단: 방 + 오버레이 버튼 ── */}
            <div style={{ padding: 'var(--space-3) var(--space-3) 0', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
                    {/* 방 미리보기 감싸기 (배경 클릭 시 이동) */}
                    <div
                        className="relative cursor-pointer group"
                        onClick={() => router.push('/room')}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <RoomView
                            roomConfig={roomConfig}
                            character={character}
                            onEditRoom={onEditRoom}
                            hideEditButton
                        />
                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                                      flex items-center justify-center transition-opacity rounded-[24px]">
                            <span
                                style={{ color: 'var(--color-text-inverse)' }}
                                className="font-semibold text-sm"
                            >
                                방 꾸미기
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '20%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-5)',
                            zIndex: 10,
                        }}
                    >
                        <CircleButton imageSrc="/icons/btn-exchange.png" onClick={onGoExchange} label="환전소" />
                        <CircleButton imageSrc="/icons/btn-store.png" onClick={onGoStore} label="상점" />
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '20%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-5)',
                            zIndex: 10,
                        }}
                    >
                        <CircleButton imageSrc="/icons/btn-ad.png" onClick={onWatchAd} label="광고 시청" />
                        <CircleButton imageSrc="/icons/btn-mission.png" onClick={onGoMission} label="미션 수행" />
                    </div>
                </div>
            </div>

            {/* ── 하단: 경험치 바 카드 ── */}
            {character && (
                <div style={{ padding: '10px 10px 0px', flexShrink: 0 }}>
                    <div
                        style={{
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-4)',
                            background: 'var(--color-bg-card)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-5)',
                        }}
                    >
                        <div
                            style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--color-primary)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                                Lv.
                            </span>
                            <span
                                className="fc-font-point"
                                style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: '#fff', lineHeight: 1 }}
                            >
                                {character.stage}
                            </span>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 'var(--space-1)',
                                }}
                            >
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                                    경험치
                                </span>
                                <span
                                    className="fc-font-point"
                                    style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 700 }}
                                >
                                    {character.exp} / 10
                                </span>
                            </div>
                            <div
                                style={{
                                    height: '10px',
                                    width: '100%',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--color-primary-light)',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${expPercent}%`,
                                        borderRadius: 'var(--radius-full)',
                                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))',
                                        transition: 'width var(--transition-slow)',
                                    }}
                                />
                            </div>
                            {character.isGraduatable && (
                                <button
                                    className="fc-btn-primary"
                                    onClick={onGraduate}
                                    style={{ width: '100%', marginTop: '12px' }}
                                >
                                    졸업하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
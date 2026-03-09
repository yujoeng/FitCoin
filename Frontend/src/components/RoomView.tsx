// src/components/RoomView.tsx
import type { RoomConfig, UserCharacter, FurnitureSlot } from '@/types/home';

interface RoomViewProps {
    roomConfig: RoomConfig;
    character: UserCharacter | null;
    onEditRoom: () => void;
    /** true면 편집 버튼 숨김 — HomeView에서 원형 버튼으로 대체할 때 사용 */
    hideEditButton?: boolean;
}

const PLACEHOLDER_COLORS: Record<FurnitureSlot | 'character', string> = {
    wallpaper: '#D6E4F5',
    floor: '#C8B89A',
    window: '#B8D8F0',
    leftItem: '#B8D4C8',
    rightItem: '#D4B8C8',
    decoration: '#F5E8D6',
    character: '#E8D6F5',
};

function SlotImage({
    src,
    alt,
    slotKey,
    objectFit = 'contain', // 추가: 기본값은 contain 유지
}: {
    src: string;
    alt: string;
    slotKey: FurnitureSlot | 'character';
    objectFit?: 'contain' | 'cover'; // 추가
}) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className="fc-no-drag"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: objectFit, // 수정: props로 받은 objectFit 적용
                }}
            />
        );
    }

    // 캐릭터 슬롯은 이미지가 없을 때 플레이스홀더를 보여주지 않음
    if (slotKey === 'character' && !src) {
        return null; // 렌더링하지 않음
    }

    // 캐릭터 이외의 슬롯은 기존 플레이스홀더 렌더링
    return (
        <div
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: PLACEHOLDER_COLORS[slotKey],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                opacity: 0.6,
                borderRadius: 'var(--radius-sm)',
            }}
        >
            {alt}
        </div>
    );
}

export default function RoomView({ roomConfig, character, onEditRoom, hideEditButton = false }: RoomViewProps) {
    const { wallpaper, floor, window: windowItem, leftItem, rightItem, decoration } = roomConfig;

    return (
        <div
            className="fc-no-drag"
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 4', // 수정: 3:4 세로 비율로 변경
                minHeight: '360px', // 수정: 세로형 비율에 맞게 늘림
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden', // 추가: 부모 컨테이너 모서리 넘어가는 배경 자르기
                background: PLACEHOLDER_COLORS.wallpaper,
                boxShadow: 'var(--shadow-md)',
            }}
        >
            {/* 레이어 1: 벽지 — 바닥 높이를 제외한 상단 구역 꽉 채우기 */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 'calc(100% - var(--room-floor-height))', zIndex: 0 }}>
                <SlotImage src={wallpaper?.imageSrc ?? ''} alt="벽지" slotKey="wallpaper" objectFit="cover" />
            </div>

            {/* 레이어 2: 바닥 — CSS background-image repeat 타일 방식 */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'var(--room-floor-height)',
                zIndex: 1,
                backgroundColor: PLACEHOLDER_COLORS.floor, // 이미지가 없거나 깨졌을 때 기본 배경색
                backgroundImage: floor?.imageSrc ? `url('${floor.imageSrc}')` : 'none',
                backgroundRepeat: 'repeat-x',    // 수정: 세로는 1장, 가로로만 반복
                backgroundPosition: 'bottom left', // 좌측 하단 기준 정렬 유지
                backgroundSize: 'auto 100%', // 수정: 이미지 세로가 바닥 영역 높이를 꽉 채우도록
            }}>
                {/* 텍스트 플레이스홀더 (이미지가 없을 때만) */}
                {!floor?.imageSrc && (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        opacity: 0.6,
                    }}>
                        바닥
                    </div>
                )}
            </div>

            {/* 레이어 2.5: 창문 — 벽 중앙 */}
            <div style={{
                position: 'absolute',
                top: 'var(--room-window-top)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'var(--room-window-width)',
                height: 'var(--room-window-height)',
                zIndex: 2,
            }}>
                <SlotImage src={windowItem?.imageSrc ?? ''} alt="창문" slotKey="window" />
            </div>

            {/* 레이어 3: 장식품 — 상단 중앙 */}
            <div style={{
                position: 'absolute',
                top: 'var(--room-deco-top)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'var(--room-deco-width)',
                height: 'var(--room-deco-height)',
                zIndex: 2,
            }}>
                <SlotImage src={decoration?.imageSrc ?? ''} alt="장식품" slotKey="decoration" />
            </div>

            {/* 레이어 4: 좌측 아이템 */}
            <div style={{
                position: 'absolute',
                bottom: 'var(--room-side-item-bottom)',
                left: 'var(--room-side-item-inset)',
                width: 'var(--room-side-item-width)',
                height: 'var(--room-side-item-height)',
                zIndex: 2,
            }}>
                <SlotImage src={leftItem?.imageSrc ?? ''} alt="좌측 아이템" slotKey="leftItem" />
            </div>

            {/* 레이어 5: 우측 아이템 */}
            <div style={{
                position: 'absolute',
                bottom: 'var(--room-side-item-bottom)',
                right: 'var(--room-side-item-inset)',
                width: 'var(--room-side-item-width)',
                height: 'var(--room-side-item-height)',
                zIndex: 2,
            }}>
                <SlotImage src={rightItem?.imageSrc ?? ''} alt="우측 아이템" slotKey="rightItem" />
            </div>

            {/* 레이어 6: 캐릭터 */}
            <div style={{
                position: 'absolute',
                bottom: 'var(--room-char-bottom)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'var(--room-char-width)',
                height: 'var(--room-char-height)',
                zIndex: 3,
            }}>
                <SlotImage
                    src={character?.imageSrc ?? ''}
                    alt={character?.name ?? '캐릭터'}
                    slotKey="character"
                />
            </div>

            {/* 편집 버튼 — hideEditButton이 false일 때만 표시 */}
            {!hideEditButton && (
                <button
                    onClick={onEditRoom}
                    className="fc-pressable"
                    style={{
                        position: 'absolute',
                        bottom: 'var(--space-3)',
                        right: 'var(--space-3)',
                        zIndex: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-primary)',
                        color: 'var(--color-text-inverse)',
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        boxShadow: 'var(--shadow-sm)',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    aria-label="가구 편집"
                >
                    ✏️ 편집
                </button>
            )}
        </div>
    );
}
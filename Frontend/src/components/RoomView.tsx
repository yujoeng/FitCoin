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
    leftItem: '#B8D4C8',
    rightItem: '#D4B8C8',
    decoration: '#F5E8D6',
    character: '#E8D6F5',
};

function SlotImage({
    src,
    alt,
    slotKey,
}: {
    src: string;
    alt: string;
    slotKey: FurnitureSlot | 'character';
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
                    objectFit: 'contain',
                }}
            />
        );
    }

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
    const { wallpaper, floor, leftItem, rightItem, decoration } = roomConfig;

    return (
        <div
            className="fc-no-drag"
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                minHeight: '220px',
                borderRadius: 'var(--radius-xl)',
                background: PLACEHOLDER_COLORS.wallpaper,
                boxShadow: 'var(--shadow-md)',
            }}
        >
            {/* 레이어 1: 벽지 */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <SlotImage src={wallpaper?.imageSrc ?? ''} alt="벽지" slotKey="wallpaper" />
            </div>

            {/* 레이어 2: 바닥 */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'var(--room-floor-height)', zIndex: 1 }}>
                <SlotImage src={floor?.imageSrc ?? ''} alt="바닥" slotKey="floor" />
            </div>

            {/* 레이어 3: 장식품 */}
            <div style={{
                position: 'absolute',
                top: '4%',
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
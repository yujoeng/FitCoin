import type { RoomConfig, UserCharacter, FurnitureSlot } from '@/types/home';
import AppImage from '@/shared/components/AppImage';

interface RoomViewProps {
  roomConfig: RoomConfig;
  character: UserCharacter | null;
  onEditRoom: () => void;
  /** true면 편집 버튼 숨김 — HomeView에서 원형 버튼으로 대체할 때 사용 */
  hideEditButton?: boolean;
}

const PLACEHOLDER_COLORS: Record<FurnitureSlot | 'character', string> = {
  wallpaper: '#FDF2D0',
  floor: '#C8B89A',
  window: '#B3E5FC',
  left: '#B8D4C8',
  right: '#D4B8C8',
  hidden: '#F5E8D6',
  character: '#E8D6F5',
};

const FALLBACK_WALLPAPER =
  'https://j14a504.p.ssafy.io/minio/theme/poor%2Fwallpaper.png';
const FALLBACK_FLOOR =
  'https://j14a504.p.ssafy.io/minio/theme/poor%2Ffloor.png';

function SlotImage({
  src,
  alt,
  slotKey,
  objectFit = 'contain',
}: {
  src: string;
  alt: string;
  slotKey: FurnitureSlot | 'character';
  objectFit?: 'contain' | 'cover';
}) {
  if (!src) {
    return null;
  }

  return (
    <AppImage
      src={src}
      alt={alt}
      className='fc-no-drag'
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: objectFit,
      }}
    />
  );
}

export default function RoomView({
  roomConfig,
  character,
  onEditRoom,
  hideEditButton = false,
}: RoomViewProps) {
  const {
    wallpaper,
    floor,
    window: windowItem,
    left,
    right,
    hidden,
  } = roomConfig;
  const isEmpty =
    !wallpaper?.imageUrl &&
    !floor?.imageUrl &&
    !windowItem?.imageUrl &&
    !left?.imageUrl &&
    !right?.imageUrl &&
    !hidden?.imageUrl;

  return (
    <div
      className='fc-no-drag'
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: PLACEHOLDER_COLORS.wallpaper,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* 레이어 1: 벽지 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 'calc(100% - var(--room-floor-height))',
          zIndex: 0,
        }}
      >
        <SlotImage
          src={wallpaper?.imageUrl ?? FALLBACK_WALLPAPER}
          alt='벽지'
          slotKey='wallpaper'
          objectFit='cover'
        />
      </div>

      {/* 레이어 2: 바닥 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--room-floor-height)',
          zIndex: 1,
          backgroundImage: `url('${floor?.imageUrl ?? FALLBACK_FLOOR}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%',
        }}
      />

      {/* 레이어 2.5: 창문 */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--room-window-top)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'var(--room-window-width)',
          height: 'var(--room-window-height)',
          zIndex: 2,
        }}
      >
        <SlotImage
          src={windowItem?.imageUrl ?? ''}
          alt='창문'
          slotKey='window'
        />
      </div>

      {/* 레이어 3: 장식 */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--room-deco-top)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'var(--room-deco-width)',
          height: 'var(--room-deco-height)',
          zIndex: 2,
        }}
      >
        <SlotImage src={hidden?.imageUrl ?? ''} alt='장식' slotKey='hidden' />
      </div>

      {/* 레이어 4: 아이템1 */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--room-side-item-bottom)',
          left: 'var(--room-side-item-inset)',
          width: 'var(--room-side-item-width)',
          height: 'var(--room-side-item-height)',
          zIndex: 2,
        }}
      >
        <SlotImage src={left?.imageUrl ?? ''} alt='아이템1' slotKey='left' />
      </div>

      {/* 레이어 5: 아이템2 */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--room-side-item-bottom)',
          right: 'var(--room-side-item-inset)',
          width: 'var(--room-side-item-width)',
          height: 'var(--room-side-item-height)',
          zIndex: 2,
        }}
      >
        <SlotImage src={right?.imageUrl ?? ''} alt='아이템2' slotKey='right' />
      </div>

      {/* 레이어 6: 캐릭터 */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--room-char-bottom)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'var(--room-char-width)',
          height: 'var(--room-char-height)',
          zIndex: 3,
        }}
      >
        <SlotImage
          src={character?.imageSrc ?? ''}
          alt={character?.name ?? '캐릭터'}
          slotKey='character'
        />
      </div>

      {!hideEditButton && (
        <button
          onClick={onEditRoom}
          className='fc-pressable'
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
          aria-label='가구 편집'
        >
          편집
        </button>
      )}
    </div>
  );
}

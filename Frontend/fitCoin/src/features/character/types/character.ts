// src/features/character/types/character.ts

export interface CharacterDexItem {
  id: number;          // 1~17
  name: string;        // '땃쥐', '호랑이' 등
  description: string; // 캐릭터 설명
  collected: boolean;  // true: 졸업시킨 적 있음 / false: 미수집
  images: {
    before: string;    // '/characters/before/땃쥐.png'
    exercise: string;  // '/characters/exercise/땃쥐.png'
    after: string;     // '/characters/after/땃쥐.png'
  };
}

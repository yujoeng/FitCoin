// src/features/character/data/characterDex.ts

import type { CharacterDexItem } from '../types/character';

export const TOTAL_CHARACTER_COUNT = 17;

export const CHARACTER_DEX_DATA: CharacterDexItem[] = [
  {
    id: 1,
    name: '강아지',
    description: '꼬리를 흔들며 달리기를 좋아하는 명랑한 운동 파트너.',
    collected: true,
    images: {
      before: '/characters/before/강아지.png',
      exercise: '/characters/exercise/강아지.png',
      after: '/characters/after/강아지.png',
    },
  },
  {
    id: 2,
    name: '개구리',
    description: '폴짝폴짝 점프로 어떤 장애물도 거뜬히 넘어버린다.',
    collected: true,
    images: {
      before: '/characters/before/개구리.png',
      exercise: '/characters/exercise/개구리.png',
      after: '/characters/after/개구리.png',
    },
  },
  {
    id: 3,
    name: '고양이',
    description: '우아한 스트레칭으로 하루를 시작하는 유연함의 달인.',
    collected: true,
    images: {
      before: '/characters/before/고양이.png',
      exercise: '/characters/exercise/고양이.png',
      after: '/characters/after/고양이.png',
    },
  },
  {
    id: 4,
    name: '늑대',
    description: '무리를 이끄는 강인한 체력의 소유자, 절대 포기하지 않는다.',
    collected: true,
    images: {
      before: '/characters/before/늑대.png',
      exercise: '/characters/exercise/늑대.png',
      after: '/characters/after/늑대.png',
    },
  },
  {
    id: 5,
    name: '도치',
    description: '작은 몸에 단단한 의지를 품은 뾰족뾰족 운동 마니아.',
    collected: false,
    images: {
      before: '/characters/before/도치.png',
      exercise: '/characters/exercise/도치.png',
      after: '/characters/after/도치.png',
    },
  },
  {
    id: 6,
    name: '돼지',
    description: '맛있는 건강식을 먹으며 꾸준히 몸을 만드는 긍정의 아이콘.',
    collected: false,
    images: {
      before: '/characters/before/돼지.png',
      exercise: '/characters/exercise/돼지.png',
      after: '/characters/after/돼지.png',
    },
  },
  {
    id: 7,
    name: '드래곤',
    description: '화염 같은 열정으로 모든 운동을 불태우는 전설의 존재.',
    collected: false,
    images: {
      before: '/characters/before/드래곤.png',
      exercise: '/characters/exercise/드래곤.png',
      after: '/characters/after/드래곤.png',
    },
  },
  {
    id: 8,
    name: '땃쥐',
    description: '초소형이지만 운동량만큼은 누구에게도 지지 않는 파이터.',
    collected: false,
    images: {
      before: '/characters/before/땃쥐.png',
      exercise: '/characters/exercise/땃쥐.png',
      after: '/characters/after/땃쥐.png',
    },
  },
  {
    id: 9,
    name: '말',
    description: '드넓은 벌판을 질주하며 자유를 만끽하는 스피드의 화신.',
    collected: false,
    images: {
      before: '/characters/before/말.png',
      exercise: '/characters/exercise/말.png',
      after: '/characters/after/말.png',
    },
  },
  {
    id: 10,
    name: '북극곰',
    description: '혹독한 추위도 거뜬히 이겨내는 강철 체력의 북극 전사.',
    collected: false,
    images: {
      before: '/characters/before/북극곰.png',
      exercise: '/characters/exercise/북극곰.png',
      after: '/characters/after/북극곰.png',
    },
  },
  {
    id: 11,
    name: '소',
    description: '느리지만 꾸준한 노력으로 마침내 목표를 이루는 성실함의 상징.',
    collected: false,
    images: {
      before: '/characters/before/소.png',
      exercise: '/characters/exercise/소.png',
      after: '/characters/after/소.png',
    },
  },
  {
    id: 12,
    name: '염소',
    description: '험한 산길도 거뜬히 오르는 타고난 클라이머.',
    collected: false,
    images: {
      before: '/characters/before/염소.png',
      exercise: '/characters/exercise/염소.png',
      after: '/characters/after/염소.png',
    },
  },
  {
    id: 13,
    name: '원숭이',
    description: '나무 사이를 날아다니듯 운동을 즐기는 천재적인 운동신경.',
    collected: false,
    images: {
      before: '/characters/before/원숭이.png',
      exercise: '/characters/exercise/원숭이.png',
      after: '/characters/after/원숭이.png',
    },
  },
  {
    id: 14,
    name: '쿼카',
    description: '세상에서 가장 행복한 표정으로 운동하는 힐링 캐릭터.',
    collected: false,
    images: {
      before: '/characters/before/쿼카.png',
      exercise: '/characters/exercise/쿼카.png',
      after: '/characters/after/쿼카.png',
    },
  },
  {
    id: 15,
    name: '토끼',
    description: '귀를 펄럭이며 달리는 속도만큼 회복력도 빠른 에너지 덩어리.',
    collected: false,
    images: {
      before: '/characters/before/토끼.png',
      exercise: '/characters/exercise/토끼.png',
      after: '/characters/after/토끼.png',
    },
  },
  {
    id: 16,
    name: '햄스터',
    description: '쳇바퀴를 돌리듯 지칠 줄 모르는 초강력 지구력의 소유자.',
    collected: false,
    images: {
      before: '/characters/before/햄스터.png',
      exercise: '/characters/exercise/햄스터.png',
      after: '/characters/after/햄스터.png',
    },
  },
  {
    id: 17,
    name: '호랑이',
    description: '백수의 왕답게 모든 운동을 압도적인 퍼포먼스로 소화한다.',
    collected: false,
    images: {
      before: '/characters/before/호랑이.png',
      exercise: '/characters/exercise/호랑이.png',
      after: '/characters/after/호랑이.png',
    },
  },
];

export const FITCOIN_EXERCISE_OVERHEAD_PRESS = {
  id: 'overheadPress',
  name: '오버헤드 프레스',
  icon: 'ArrowUpToLine',
  description: '양팔을 머리 위로 쭉 올렸다 어깨 높이로 내리세요 (아령 가능)',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '어깨',
};

// 손목(15/16)이 어깨(11/12)보다 위에 있으면 'up'
// 손목이 어깨보다 아래로 내려오면 카운트
export function detectOverheadPress(landmarks, state, setCount, setState) {
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  // 손목 y좌표가 작을수록 위 (MediaPipe: y=0이 화면 위)
  const leftUp = leftWrist.y < leftShoulder.y - 0.08;
  const rightUp = rightWrist.y < rightShoulder.y - 0.08;
  const bothUp = leftUp && rightUp;

  const leftDown = leftWrist.y > leftShoulder.y + 0.03;
  const rightDown = rightWrist.y > rightShoulder.y + 0.03;
  const bothDown = leftDown && rightDown;

  const dispY = Math.round(Math.abs(((leftWrist.y + rightWrist.y) / 2) - ((leftShoulder.y + rightShoulder.y) / 2)) * 100);

  if (bothUp && state === 'down') setState('up');
  else if (bothDown && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return dispY;
}

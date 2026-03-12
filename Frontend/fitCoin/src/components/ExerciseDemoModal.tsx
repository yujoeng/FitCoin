'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X, Play } from 'lucide-react';
import type { Exercise } from '@/types';

/* ─────────────────────────────────────────
   운동별 3D 데모 설정
───────────────────────────────────────── */
type Parts = {
  group: THREE.Group;
  head: THREE.Mesh;
  neckGroup: THREE.Group;
  torso: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Group;
  rightForearm: THREE.Group;
  leftHand: THREE.Group;
  rightHand: THREE.Group;
  leftUpper: THREE.Group;
  leftLower: THREE.Group;
  leftFoot: THREE.Mesh;
  rightUpper: THREE.Group;
  rightLower: THREE.Group;
  rightFoot: THREE.Mesh;
};

type DemoConfig = {
  label: string;
  hint: string;
  disableGroupRotation?: boolean;
  cameraOverride?: { position: [number, number, number]; lookAt: [number, number, number] };
  animate: (parts: Parts, t: number) => void;
};

const DEMO_CONFIG: Record<string, DemoConfig> = {
  // ── 하체 ──────────────────────────────────────────
  squat: {
    label: '스쿼트',
    hint: '발을 어깨 너비로 벌리고\n무릎을 90°까지 굽혔다 펴세요',
    animate: (parts, t) => {
      const phase = (Math.sin(t * 1.3) + 1) / 2;
      const wave  = phase * phase * (3 - 2 * phase);
      parts.torso.position.y = 1.12 - wave * 0.45;
      parts.torso.rotation.x = wave * 0.28;
      parts.torso.rotation.z = 0;
      parts.leftUpper.rotation.x  = wave * 1.25;  parts.rightUpper.rotation.x = wave * 1.25;
      parts.leftLower.rotation.x  = -wave * 1.55; parts.rightLower.rotation.x = -wave * 1.55;
      parts.leftArm.rotation.x    = wave * 0.9;   parts.rightArm.rotation.x   = wave * 0.9;
      parts.leftArm.rotation.z    = -0.25;         parts.rightArm.rotation.z   = 0.25;
      if (parts.leftFoot)  parts.leftFoot.rotation.x  = -wave * 0.22;
      if (parts.rightFoot) parts.rightFoot.rotation.x = -wave * 0.22;
    },
  },
  lunge: {
    label: '런지',
    hint: '한 발씩 앞으로 내딛어\n무릎을 90°로 굽히세요',
    animate: (parts, t) => {
      const phase = (Math.sin(t * 1.2) + 1) / 2;
      const eased = phase * phase * (3 - 2 * phase);
      parts.leftUpper.rotation.x  = -eased * 1.2;
      parts.leftLower.rotation.x  =  eased * 1.6;
      parts.rightUpper.rotation.x =  eased * 0.8;
      parts.rightLower.rotation.x = -eased * 0.5;
      parts.torso.position.y = 1.12 - eased * 0.3;
      parts.torso.rotation.x = eased * 0.15;
      parts.torso.rotation.z = 0;
      parts.leftArm.rotation.x  =  eased * 0.5;  parts.leftArm.rotation.z  = -0.25;
      parts.rightArm.rotation.x = -eased * 0.5;  parts.rightArm.rotation.z =  0.25;
    },
  },
  calfRaise: {
    label: '카프레이즈',
    hint: '발뒤꿈치를 최대한 높이\n올렸다 천천히 내려주세요',
    cameraOverride: { position: [3.2, 1.0, 1.0], lookAt: [0, 0.4, 0] },
    animate: (parts, t) => {
      const cycle = (t * 1.0) % (Math.PI * 2);
      const raw   = Math.sin(cycle);
      const wave  = raw > 0 ? Math.pow(raw, 0.5) : 0;
      parts.group.position.y = -0.45 + wave * 0.08;
      parts.torso.position.y = 1.12;
      parts.torso.rotation.x = 0; parts.torso.rotation.z = 0;
      parts.leftUpper.rotation.x  = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x  = 0; parts.rightLower.rotation.x = 0;
      if (parts.leftFoot)  parts.leftFoot.rotation.x  = wave * 0.65;
      if (parts.rightFoot) parts.rightFoot.rotation.x = wave * 0.65;
      parts.leftArm.rotation.x = 0; parts.leftArm.rotation.z  = -0.25;
      parts.rightArm.rotation.x = 0; parts.rightArm.rotation.z =  0.25;
    },
  },
  kneeRaise: {
    label: '무릎 올리기',
    hint: '무릎을 번갈아 가슴 쪽으로\n높이 올려주세요',
    animate: (parts, t) => {
      const cycle = (t * 0.8) % (Math.PI * 2);
      const raw   = Math.sin(cycle);
      const held  = Math.pow(Math.max(0, raw), 0.35);
      const LW    = cycle < Math.PI ? held : 0;
      const RW    = cycle >= Math.PI ? held : 0;
      parts.torso.position.y = 1.12;
      parts.torso.rotation.x = 0; parts.torso.rotation.z = 0;
      parts.leftUpper.rotation.x  = -LW * 1.8; parts.leftLower.rotation.x  = LW * 1.4;
      parts.rightUpper.rotation.x = -RW * 1.8; parts.rightLower.rotation.x = RW * 1.4;
      parts.leftArm.rotation.x  =  RW * 0.5; parts.leftArm.rotation.z  = -0.25;
      parts.rightArm.rotation.x =  LW * 0.5; parts.rightArm.rotation.z =  0.25;
    },
  },
  plank: {
    label: '플랭크',
    hint: '팔을 뻗어 몸을 일직선으로\n유지하세요 (10초 유지)',
    animate: (parts, t) => {
      const wb = Math.sin(t * 1.2) * 0.025;
      parts.torso.position.y = 0.72 + wb;
      parts.torso.rotation.x = -1.25 + wb * 0.5;
      parts.torso.rotation.z = 0;
      parts.leftArm.rotation.x  = 1.15;  parts.rightArm.rotation.x = 1.15;
      parts.leftArm.rotation.z  = -0.25; parts.rightArm.rotation.z  = 0.25;
      parts.leftUpper.rotation.x  = -0.08; parts.rightUpper.rotation.x = -0.08;
      parts.leftLower.rotation.x  =  0.12; parts.rightLower.rotation.x =  0.12;
      if (parts.leftFoot)  parts.leftFoot.rotation.x  = 1.22;
      if (parts.rightFoot) parts.rightFoot.rotation.x = 1.22;
    },
  },
  hipHinge: {
    label: '힙힌지',
    hint: '엉덩이를 뒤로 빼며 상체를\n앞으로 60° 정도 숙이세요',
    animate: (parts, t) => {
      const wave = (Math.sin(t * 1.2) + 1) / 2;
      parts.torso.rotation.x  = -wave * 0.9;
      parts.torso.position.y  = 1.12;
      parts.torso.rotation.z  = 0;
      (parts.leftUpper.parent as THREE.Group).rotation.x  = wave * 0.9;
      (parts.rightUpper.parent as THREE.Group).rotation.x = wave * 0.9;
      parts.leftUpper.rotation.x  = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x  = 0; parts.rightLower.rotation.x = 0;
      parts.leftArm.rotation.x  = 0;     parts.rightArm.rotation.x  = 0;
      parts.leftArm.rotation.z  = -0.25; parts.rightArm.rotation.z  = 0.25;
      if (parts.leftFoot)  parts.leftFoot.rotation.x  = -wave * 0.55;
      if (parts.rightFoot) parts.rightFoot.rotation.x = -wave * 0.55;
    },
  },
  sideStretch: {
    label: '옆구리 스트레칭',
    hint: '몸통을 좌우로 기울여\n옆구리를 충분히 늘려주세요',
    cameraOverride: { position: [0, 1.4, 3.2], lookAt: [0, 1.1, 0] },
    animate: (parts, t) => {
      const sw = Math.sin(t * 0.9);
      parts.torso.rotation.z = sw * 0.38;
      parts.torso.rotation.x = 0;
      parts.torso.position.y = 1.12;
      (parts.leftUpper.parent as THREE.Group).rotation.z  = -sw * 0.38;
      (parts.rightUpper.parent as THREE.Group).rotation.z = -sw * 0.38;
      parts.leftLower.rotation.z  = 0;
      parts.rightLower.rotation.z = 0;
      parts.leftArm.rotation.z  = -0.25; parts.leftArm.rotation.x  = 0;
      parts.rightArm.rotation.z =  0.25; parts.rightArm.rotation.x = 0;
      parts.leftUpper.rotation.x = 0;    parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0;    parts.rightLower.rotation.x = 0;
    },
  },
  shoulderRaise: {
    label: '숄더레이즈',
    hint: '팔을 옆으로 어깨 높이까지\n들어올렸다 내려주세요',
    animate: (parts, t) => {
      const phase = (Math.sin(t * 1.3) + 1) / 2;
      const wave  = phase * phase * (3 - 2 * phase);
      parts.torso.position.y = 1.12; parts.torso.rotation.x = 0; parts.torso.rotation.z = 0;
      parts.leftArm.rotation.z  = -0.2 - wave * 1.3;
      parts.rightArm.rotation.z =  0.2 + wave * 1.3;
      parts.leftArm.rotation.x = 0; parts.rightArm.rotation.x = 0;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
    },
  },
  bicepCurl: {
    label: '바이셉 컬',
    hint: '팔꿈치를 굽혔다 펴며\n이두를 수축시키세요',
    animate: (parts, t) => {
      const sw = Math.sin(t * 1.4);
      const LW = (sw + 1) / 2; const RW = (-sw + 1) / 2;
      parts.torso.position.y = 1.12; parts.torso.rotation.x = 0; parts.torso.rotation.z = 0;
      parts.leftArm.rotation.x  = 0;    parts.rightArm.rotation.x = 0;
      parts.leftArm.rotation.z  = -0.18; parts.rightArm.rotation.z =  0.18;
      if (parts.leftForearm)  parts.leftForearm.rotation.x  = -LW * 2.0;
      if (parts.rightForearm) parts.rightForearm.rotation.x = -RW * 2.0;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
    },
  },
  overheadPress: {
    label: '오버헤드 프레스',
    hint: '양팔을 머리 위로 뻗었다\n어깨 높이로 내려주세요',
    animate: (parts, t) => {
      const phase = (Math.sin(t * 1.1) + 1) / 2;
      const wave  = phase * phase * (3 - 2 * phase);
      const armAngle = -1.57 - wave * 1.28;
      parts.torso.position.y = 1.12; parts.torso.rotation.x = 0; parts.torso.rotation.z = 0;
      parts.leftArm.rotation.x  = armAngle;
      parts.rightArm.rotation.x = armAngle;
      parts.leftArm.rotation.z  = -0.25 + wave * 0.22;
      parts.rightArm.rotation.z =  0.25 - wave * 0.22;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
    },
  },
  shoulderShrug: {
    label: '어깨 으쓱',
    hint: '어깨를 귀 쪽으로 으쓱\n올렸다 내려주세요',
    animate: (parts, t) => {
      const wave = (Math.sin(t * 2.0) + 1) / 2;
      parts.torso.position.y = 1.12; parts.torso.rotation.x = 0; parts.torso.rotation.z = 0;
      parts.leftArm.position.y  = 0.2 + wave * 0.25;
      parts.rightArm.position.y = 0.2 + wave * 0.25;
      parts.leftArm.rotation.z  = -0.25;
      parts.rightArm.rotation.z =  0.25;
      parts.leftArm.rotation.x = 0; parts.rightArm.rotation.x = 0;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
    },
  },
  chestOpen: {
    label: '가슴 펴기',
    hint: '팔을 T자로 벌린 뒤\n상체를 뒤로 젖혀 가슴을 펴주세요',
    disableGroupRotation: true,
    cameraOverride: { position: [3.2, 1.3, 0.5], lookAt: [0, 1.05, 0] },
    animate: (parts, t) => {
      parts.group.rotation.y = Math.PI / 2;
      parts.torso.rotation.z = 0;
      parts.torso.position.y = 1.12;
      parts.leftUpper.rotation.x  = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x  = 0; parts.rightLower.rotation.x = 0;
      const raiseProgress = Math.min(t / 0.4, 1.0);
      const raiseDone = raiseProgress * raiseProgress * (3 - 2 * raiseProgress);
      parts.leftArm.rotation.z  = -0.25 - raiseDone * 1.35;
      parts.rightArm.rotation.z =  0.25 + raiseDone * 1.35;
      parts.leftArm.rotation.x  = raiseDone * 0.2;
      parts.rightArm.rotation.x = raiseDone * 0.2;
      const bodyT = Math.max(0, t - 0.4);
      const sw = Math.sin(bodyT * 1.2);
      parts.torso.rotation.x = sw * 0.45;
      (parts.leftUpper.parent as THREE.Group).rotation.x  = -sw * 0.45;
      (parts.rightUpper.parent as THREE.Group).rotation.x = -sw * 0.45;
    },
  },
  wristStretch: {
    label: '손목 스트레칭',
    hint: '팔을 앞으로 뻗고\n손목을 천천히 꺾어주세요',
    cameraOverride: { position: [0, 1.05, 2.3], lookAt: [0, 0.88, 0] },
    animate: (parts, t) => {
      parts.leftArm.rotation.x  = -1.57;
      parts.rightArm.rotation.x = -1.57;
      parts.leftArm.rotation.z  = -0.25;
      parts.rightArm.rotation.z =  0.25;
      parts.torso.rotation.x = 0; parts.torso.rotation.z = 0; parts.torso.position.y = 1.12;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
      if (parts.leftForearm)  parts.leftForearm.rotation.x  = 0;
      if (parts.rightForearm) parts.rightForearm.rotation.x = 0;
      const bend = Math.sin(t * 0.8) * 0.9;
      if (parts.leftHand)  parts.leftHand.rotation.x  = bend;
      if (parts.rightHand) parts.rightHand.rotation.x = bend;
    },
  },
  neckSideStretch: {
    label: '목 옆 스트레칭',
    hint: '고개를 천천히 좌우로\n기울여주세요',
    disableGroupRotation: true,
    animate: (parts, t) => {
      parts.group.rotation.y = 0;
      parts.torso.rotation.x = 0; parts.torso.rotation.z = 0; parts.torso.position.y = 1.12;
      parts.leftArm.rotation.x = 0; parts.leftArm.rotation.z = -0.25;
      parts.rightArm.rotation.x = 0; parts.rightArm.rotation.z = 0.25;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
      const sw = Math.sin(t * 0.85);
      if (parts.neckGroup) {
        parts.neckGroup.rotation.z = sw * 0.7;
        parts.neckGroup.rotation.x = 0;
      }
      if (parts.head) {
        parts.head.rotation.z = sw * 0.4;
        parts.head.rotation.x = 0;
      }
    },
  },
  neckFrontStretch: {
    label: '목 앞뒤 스트레칭',
    hint: '고개를 앞으로 숙였다가\n뒤로 젖혀주세요',
    cameraOverride: { position: [0, 1.3, 3.2], lookAt: [0, 1.2, 0] },
    disableGroupRotation: true,
    animate: (parts, t) => {
      parts.group.rotation.y = Math.PI / 2;
      parts.torso.rotation.x = 0; parts.torso.rotation.z = 0; parts.torso.position.y = 1.12;
      parts.leftArm.rotation.x = 0; parts.leftArm.rotation.z  = -0.25;
      parts.rightArm.rotation.x = 0; parts.rightArm.rotation.z =  0.25;
      parts.leftUpper.rotation.x = 0; parts.rightUpper.rotation.x = 0;
      parts.leftLower.rotation.x = 0; parts.rightLower.rotation.x = 0;
      const sw = Math.sin(t * 0.85);
      if (parts.neckGroup) {
        parts.neckGroup.rotation.x = sw * 0.7;
        parts.neckGroup.rotation.z = 0;
      }
      if (parts.head) {
        parts.head.rotation.x = sw * 0.45;
        parts.head.rotation.z = 0;
      }
    },
  },
  default: {
    label: '운동',
    hint: '안내에 따라 동작하세요',
    animate: (parts, t) => {
      const sw = Math.sin(t * 2.4);
      parts.torso.position.y = 1.12; parts.torso.rotation.x = 0; parts.torso.rotation.z = sw * 0.06;
      parts.leftArm.rotation.x   =  sw * 0.75; parts.leftArm.rotation.z   = -0.25;
      parts.rightArm.rotation.x  = -sw * 0.75; parts.rightArm.rotation.z  =  0.25;
      parts.leftUpper.rotation.x =  sw * 0.2;  parts.rightUpper.rotation.x = -sw * 0.2;
      parts.leftLower.rotation.x = 0;           parts.rightLower.rotation.x = 0;
    },
  },
};

/* ─────────────────────────────────────────
   스틱맨 파트 빌더
───────────────────────────────────────── */
const MAT       = new THREE.MeshStandardMaterial({ color: 0xb5aca4, roughness: 0.6, metalness: 0.0 });
const HEAD_MAT  = new THREE.MeshStandardMaterial({ color: 0xc8bfb8, roughness: 0.55 });
const JOINT_MAT = new THREE.MeshStandardMaterial({ color: 0xf4a0a8, roughness: 0.3, metalness: 0.1 });
const SKIN_MAT  = new THREE.MeshStandardMaterial({ color: 0xf0e8dc, roughness: 0.65 });
const UPPER_MAT = new THREE.MeshStandardMaterial({ color: 0x9e9590, roughness: 0.5 });
const LOWER_MAT = new THREE.MeshStandardMaterial({ color: 0x7a7270, roughness: 0.5 });

function makeCylinder(rTop: number, rBot: number, height: number, mat: THREE.Material = MAT) {
  const geo = new THREE.CylinderGeometry(rTop, rBot, height, 16);
  return new THREE.Mesh(geo, mat);
}

function makeJoint(r = 0.065) {
  const geo = new THREE.SphereGeometry(r, 12, 12);
  return new THREE.Mesh(geo, JOINT_MAT);
}

function buildStickman(scene: THREE.Scene): Parts {
  const group = new THREE.Group();

  const torso = new THREE.Group();
  torso.position.y = 1.12;
  const torsoMesh = makeCylinder(0.115, 0.13, 0.68, UPPER_MAT);
  torsoMesh.position.y = 0;
  torso.add(torsoMesh);
  group.add(torso);

  const neckGroup = new THREE.Group();
  neckGroup.position.y = 0.42;
  const neckMesh = makeCylinder(0.055, 0.065, 0.12, UPPER_MAT);
  neckMesh.position.y = 0.06;
  neckGroup.add(neckMesh);
  torso.add(neckGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), HEAD_MAT);
  head.position.y = 0.25;
  neckGroup.add(head);

  const armOffset = 0.21;
  const armY = 0.2;
  const makeArm = (side: number) => {
    const g = new THREE.Group();
    const upperArm = makeCylinder(0.048, 0.055, 0.38, UPPER_MAT);
    upperArm.position.y = -0.19;
    const shoulderJoint = makeJoint(0.058);
    shoulderJoint.position.y = 0;
    g.add(upperArm, shoulderJoint);

    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -0.38;
    const elbow = makeJoint(0.055);
    elbow.position.y = 0;
    const lowerArm = makeCylinder(0.042, 0.048, 0.34);
    lowerArm.position.y = -0.17;
    const wristJoint = makeJoint(0.048);
    wristJoint.position.y = -0.38;

    const handGroup = new THREE.Group();
    handGroup.position.y = -0.42;
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.035, 0.09), SKIN_MAT);
    palm.position.y = 0;

    const fingerPositions = [-0.05, -0.025, 0, 0.025, 0.05];
    const fingerLengths   = [0.048,  0.056, 0.058, 0.054, 0.044];
    fingerPositions.forEach((fx, i) => {
      const f = makeCylinder(0.011, 0.011, fingerLengths[i], SKIN_MAT);
      f.position.set(fx, -(fingerLengths[i] / 2 + 0.02), 0);
      handGroup.add(f);
    });
    handGroup.add(palm);

    forearmGroup.add(elbow, lowerArm, wristJoint, handGroup);
    g.add(forearmGroup);
    g.position.set(side * armOffset, armY, 0);
    g.rotation.z = side * 0.25;
    return { g, forearmGroup, handGroup };
  };
  const leftArmData  = makeArm(-1);
  const rightArmData = makeArm(1);
  const leftArm  = leftArmData.g;
  const rightArm = rightArmData.g;
  torso.add(leftArm, rightArm);

  const hipY = -0.34;
  const makeLeg = (side: number) => {
    const root = new THREE.Group();
    root.position.set(side * 0.13, hipY, 0);
    const hipJoint = makeJoint(0.07);
    root.add(hipJoint);

    const upperLeg = new THREE.Group();
    const upperMesh = makeCylinder(0.07, 0.075, 0.48, LOWER_MAT);
    upperMesh.position.y = -0.24;
    const knee = makeJoint(0.075);
    knee.position.y = -0.48;
    upperLeg.add(upperMesh, knee);
    root.add(upperLeg);

    const lowerLeg = new THREE.Group();
    lowerLeg.position.y = -0.48;
    const lowerMesh = makeCylinder(0.055, 0.06, 0.46, LOWER_MAT);
    lowerMesh.position.y = -0.23;
    const ankle = makeJoint(0.06);
    ankle.position.y = -0.46;
    lowerLeg.add(lowerMesh, ankle);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.18), SKIN_MAT);
    foot.position.set(0.01, -0.49, 0.06);
    lowerLeg.add(foot);

    upperLeg.add(lowerLeg);
    return { root, upperLeg, lowerLeg, foot };
  };

  const left  = makeLeg(-1);
  const right = makeLeg(1);
  torso.add(left.root, right.root);
  scene.add(group);

  return {
    group,
    head,
    neckGroup,
    torso,
    leftArm,
    rightArm,
    leftForearm:  leftArmData.forearmGroup,
    rightForearm: rightArmData.forearmGroup,
    leftHand:     leftArmData.handGroup,
    rightHand:    rightArmData.handGroup,
    leftUpper:  left.upperLeg,
    leftLower:  left.lowerLeg,
    leftFoot:   left.foot,
    rightUpper: right.upperLeg,
    rightLower: right.lowerLeg,
    rightFoot:  right.foot,
  };
}

/* ─────────────────────────────────────────
   메인 모달 컴포넌트
───────────────────────────────────────── */
interface ExerciseDemoModalProps {
  exercise: Exercise;
  onStart: () => void;
  onClose: () => void;
}

export default function ExerciseDemoModal({ exercise, onStart, onClose }: ExerciseDemoModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const rendRef  = useRef<THREE.WebGLRenderer | null>(null);

  const cfg = DEMO_CONFIG[exercise?.id] ?? DEMO_CONFIG.default;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    const camPos  = cfg.cameraOverride?.position ?? [0, 0.5, 4.2];
    const camLook = cfg.cameraOverride?.lookAt   ?? [0, 0.6, 0];
    camera.position.set(...camPos);
    camera.lookAt(...camLook);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(3, 5, 4);
    dir.castShadow = true;
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xffe8d0, 0.4);
    fill.position.set(-4, 2, -3);
    scene.add(fill);

    const grid = new THREE.GridHelper(4, 10, 0xd4c4b0, 0xeae0d5);
    (grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.5;
    (grid.material as THREE.Material & { transparent: boolean }).transparent = true;
    grid.position.y = -0.74;
    scene.add(grid);

    const circleGeo = new THREE.CircleGeometry(0.22, 32);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0xf4a0a8, transparent: true, opacity: 0.2 });
    const leftCircle = new THREE.Mesh(circleGeo, circleMat);
    leftCircle.rotation.x = -Math.PI / 2;
    leftCircle.position.set(-0.13, -0.73, 0);
    scene.add(leftCircle);
    const rightCircle = leftCircle.clone();
    rightCircle.position.set(0.13, -0.73, 0);
    scene.add(rightCircle);

    const parts = buildStickman(scene);
    parts.group.position.y = -0.45;

    let t = 0;
    let lastTime = performance.now();
    const animate = (now = performance.now()) => {
      rafRef.current = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      cfg.animate(parts, t);

      if (!cfg.disableGroupRotation) {
        parts.group.rotation.y = Math.sin(t * 0.3) * 0.25;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nW = el.clientWidth;
      const nH = el.clientHeight;
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [exercise]);

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>
        <div style={styles.header}>
          <div style={styles.badge}>동작 미리보기</div>
          <h2 style={styles.title}>{exercise?.name ?? '운동'}</h2>
          <p style={styles.desc}>{cfg.hint}</p>
        </div>
        <div ref={mountRef} style={styles.canvas} />
        <div style={styles.footer}>
          <button style={styles.startBtn} onClick={onStart}>
            <Play size={16} fill="white" />
            준비됐으면 시작!
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   인라인 스타일
───────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(252,251,248,0.90)',
    backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    animation: 'sqDemoFadeIn 0.22s ease',
  },
  modal: {
    background: 'linear-gradient(160deg, #fffff8 0%, #f9f8f2 100%)',
    border: '1px solid rgba(210,205,195,0.5)',
    borderRadius: 24, width: '92%', maxWidth: 380,
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 50px rgba(0,0,0,0.10), 0 0 0 1px rgba(210,205,195,0.25)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14,
    background: 'rgba(0,0,0,0.06)', border: 'none',
    borderRadius: 50, width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'rgba(60,45,35,0.6)', zIndex: 10,
  },
  header: { padding: '22px 20px 8px', textAlign: 'center' },
  badge: {
    display: 'inline-block',
    background: 'rgba(160,130,100,0.1)', border: '1px solid rgba(160,130,100,0.3)',
    color: '#7a5c40', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
    padding: '3px 12px', letterSpacing: '0.06em', marginBottom: 8,
  },
  title: { fontSize: '1.5rem', fontWeight: 900, color: '#2a2018', margin: '0 0 6px' },
  desc: { fontSize: '0.83rem', color: 'rgba(80,65,50,0.75)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-line' },
  canvas: { width: '100%', height: 340, background: 'transparent' },
  footer: { padding: '10px 20px 22px' },
  startBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, background: 'linear-gradient(135deg, #7b5ce8 0%, #9b6cf8 100%)',
    border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800,
    fontSize: '1rem', padding: '14px 0', cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(123,92,232,0.45)', letterSpacing: '0.01em',
  },
};

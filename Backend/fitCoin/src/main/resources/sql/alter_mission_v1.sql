-- mission 테이블 type enum 수정 및 레벨별 count 컬럼 추가
ALTER TABLE mission
    MODIFY COLUMN type ENUM ('ARM', 'LOWER_BODY', 'STRETCHING', 'CORE', 'CARDIO', 'SHOULDER') NOT NULL,
    ADD COLUMN beginner_count     INT NOT NULL COMMENT '입문 레벨 목표 횟수',
    ADD COLUMN intermediate_count INT NOT NULL COMMENT '중급 레벨 목표 횟수',
    ADD COLUMN advanced_count     INT NOT NULL COMMENT '고급 레벨 목표 횟수';
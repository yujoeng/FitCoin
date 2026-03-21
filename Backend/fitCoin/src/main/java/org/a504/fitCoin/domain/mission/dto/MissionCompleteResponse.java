package org.a504.fitCoin.domain.mission.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MissionCompleteResponse {
    private Long missionId;
    private int rewardPoint;
    private boolean streakIncreased;
    private boolean characterExpGained;
}
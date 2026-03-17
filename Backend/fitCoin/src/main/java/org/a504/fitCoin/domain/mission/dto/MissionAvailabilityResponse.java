package org.a504.fitCoin.domain.mission.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MissionAvailabilityResponse {
    private boolean missionAvailable;
    private int dailyMissionLimit;
    private int todayCompletedMissionCount;
}

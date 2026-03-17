package org.a504.fitCoin.domain.mission.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MissionStartResponse {

    private Long missionId;
    private String missionToken;
}
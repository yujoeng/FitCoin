package org.a504.fitCoin.domain.mission.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MissionCandidateListResponse {

    private List<MissionCandidateDto> missions;

    public static MissionCandidateListResponse from(List<MissionCandidateDto> missions) {
        return MissionCandidateListResponse.builder()
                .missions(missions)
                .build();
    }
}
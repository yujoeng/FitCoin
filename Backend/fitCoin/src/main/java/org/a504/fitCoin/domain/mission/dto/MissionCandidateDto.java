package org.a504.fitCoin.domain.mission.dto;

import lombok.Builder;
import lombok.Getter;
import org.a504.fitCoin.domain.mission.entity.Mission;

import java.util.List;

@Getter
@Builder
public class MissionCandidateDto {

    private Long id;
    private String name;
    private String description;
    private List<Integer> count;

    public static MissionCandidateDto from(Mission mission) {
        return MissionCandidateDto.builder()
                .id(mission.getId())
                .name(mission.getName())
                .description(mission.getDescription())
                .count(List.of(
                        mission.getBeginnerCount(),
                        mission.getIntermediateCount(),
                        mission.getAdvancedCount()
                ))
                .build();
    }
}
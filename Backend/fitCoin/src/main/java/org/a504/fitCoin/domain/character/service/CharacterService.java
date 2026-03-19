package org.a504.fitCoin.domain.character.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.character.dto.response.AdoptCharacterResponse;
import org.a504.fitCoin.domain.character.dto.response.CharacterDexResponse;
import org.a504.fitCoin.domain.character.dto.response.CharacterResponse;
import org.a504.fitCoin.domain.character.entity.CharacterDetail;
import org.a504.fitCoin.domain.character.entity.Characters;
import org.a504.fitCoin.domain.character.exception.CharacterErrorStatus;
import org.a504.fitCoin.domain.character.repository.CharacterDetailJpaRepository;
import org.a504.fitCoin.domain.character.repository.CharacterJpaRepository;
import org.a504.fitCoin.domain.character.value.CharacterStatus;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.entity.UserCharacter;
import org.a504.fitCoin.domain.user.entity.UserGifticon;
import org.a504.fitCoin.domain.user.repository.UserCharacterJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.UserCharacterStatus;
import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.a504.fitCoin.domain.wallet.repository.GifticonJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserGifticonJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterJpaRepository characterJpaRepository;
    private final CharacterDetailJpaRepository characterDetailJpaRepository;
    private final UserCharacterJpaRepository userCharacterJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final GifticonJpaRepository gifticonJpaRepository;
    private final UserGifticonJpaRepository userGifticonJpaRepository;

    @Transactional
    public AdoptCharacterResponse adoptCharacter(Long userId) {

        // 유저 조회
        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 졸업 상태가 아닌 캐릭터가 존재하면 에러
        userCharacterJpaRepository.findByUserIdAndStatusNot(userId, UserCharacterStatus.GRADUATED)
                .ifPresent(c -> { throw new CustomException(CharacterErrorStatus.CHARACTER_ALREADY_ACTIVE); });

        // 전체 캐릭터 조회
        List<Characters> characters = characterJpaRepository.findAll();
        if (characters.isEmpty()) {
            throw new RuntimeException("캐릭터 데이터가 없습니다. 시드 데이터를 확인해주세요.");
        }

        // 캐릭터 뽑기
        Characters picked = pickByProbability(characters);

        // user_character 테이블에 저장
        UserCharacter userCharacter = UserCharacter.builder()
                .user(user)
                .characters(picked)
                .build();
        userCharacterJpaRepository.save(userCharacter);

        // DEFAULT 이미지 URL 조회
        String imgUrl = characterDetailJpaRepository
                .findByCharactersIdAndStatus(picked.getId(), CharacterStatus.DEFAULT)
                .map(CharacterDetail::getUrl)
                .orElse(null);

        // DTO 반환
        return AdoptCharacterResponse.of(
                picked.getId(),
                picked.getName(),
                imgUrl
        );
    }

    /**
     * 확률 기반 뽑기 메서드
     * - character 테이블의 percentage 컬럼 기준으로 랜덤 선택
     * - 땃쥐 (4%), 일반 캐릭터 16종 (6%)
     */
    private Characters pickByProbability(List<Characters> characters) {
        // 0.0 ~ 100.0 사이의 랜덤 숫자 생성
        double rand = new Random().nextDouble() * 100.0;

        double cumulative = 0.0; // 누적 확률
        for (Characters character : characters) {
            cumulative += character.getPercentage();
            if (rand < cumulative) {
                return character; // 랜덤값이 누적 확률 안에 들어오면 이 캐릭터 선택
            }
        }

        // 부동소수점 오차 방어 → 마지막 캐릭터 반환
        // 부동소수점: 컴퓨터가 소수를 저장할 때 미세한 오차가 생길 수 있어요
        return characters.get(characters.size() - 1);
    }

    @Transactional(readOnly = true)
    public CharacterResponse getMyCharacter(Long userId) {

        // GROWING, AVAILABLE 상태 캐릭터 조회
        UserCharacter userCharacter = userCharacterJpaRepository
                .findByUserIdAndStatusNot(userId, UserCharacterStatus.GRADUATED)
                .orElseThrow(() -> new CustomException(CharacterErrorStatus.CHARACTER_NOT_ACTIVE));

        // 상태에 맞는 이미지 URL 조회
        String imgUrl = characterDetailJpaRepository
                .findByCharactersIdAndStatus(userCharacter.getCharacters().getId(), CharacterStatus.DEFAULT)
                .map(CharacterDetail::getUrl)
                .orElse(null);

        // DTO 반환
        return CharacterResponse.of(userCharacter, imgUrl);
    }

    @Transactional
    public void graduateCharacter(Long userId) {

        // 유저 조회
        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // AVAILABLE 상태 캐릭터 조회
        UserCharacter userCharacter = userCharacterJpaRepository
                .findByUserIdAndStatus(userId, UserCharacterStatus.AVAILABLE)
                .orElseThrow(() -> new CustomException(CharacterErrorStatus.CHARACTER_NOT_GRADUATABLE));

        // 캐릭터 졸업 처리
        userCharacter.graduate();

        // 발급 가능한 기프티콘 목록 조회
        List<Gifticon> gifticons = gifticonJpaRepository.findAll()                  ;
        if (gifticons.isEmpty()) {
            throw new CustomException(CharacterErrorStatus.GIFTICON_NOT_FOUND);
        }

        // 랜덤 기프티콘 1개 선택
        Gifticon picked = gifticons.get(new Random().nextInt(gifticons.size()));

        // 기프티콘 지급
        UserGifticon userGifticon = UserGifticon.builder()
                .user(user)
                .gifticon(picked)
                .build();
        userGifticonJpaRepository.save(userGifticon);
    }

    @Transactional(readOnly = true)
    public List<CharacterDexResponse> getCharacterDex(Long userId) {

        // 졸업시킨 캐릭터 목록 조회 (중복 제거)
        List<Characters> graduatedCharacters = userCharacterJpaRepository
                .findDistinctGraduatedCharactersByUserId(userId);

        // 각 캐릭터 이미지 URL 조회해 DTO 변환
        return graduatedCharacters.stream()
                .map(character -> {
                    // DEFAULT, GRADUATED 이미지 URL 순서대로 담기
                    List<String> imgs = characterDetailJpaRepository
                            .findByCharactersId(character.getId())
                            .stream()
                            .sorted((a, b) -> a.getStatus().compareTo(b.getStatus()))
                            // DEFAULT가 GRADUATED보다 알파벳 순서상 앞이라 DEFAULT → GRADUATED 순서로 정렬됨
                            .map(CharacterDetail::getUrl)
                            .collect(java.util.stream.Collectors.toList());

                    return CharacterDexResponse.of(character, imgs);
                })
                .collect(java.util.stream.Collectors.toList());
    }


}

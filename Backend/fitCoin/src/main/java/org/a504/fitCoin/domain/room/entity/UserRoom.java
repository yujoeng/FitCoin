package org.a504.fitCoin.domain.room.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.global.entity.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserRoom extends BaseTimeEntity {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "wall_item")
    private Long wallItem;

    @Column(name = "floor_item")
    private Long floorItem;

    @Column(name = "window_item")
    private Long windowItem;

    @Column(name = "left_item")
    private Long leftItem;

    @Column(name = "right_item")
    private Long rightItem;

    @Column(name = "hidden_item")
    private Long hiddenItem;
}
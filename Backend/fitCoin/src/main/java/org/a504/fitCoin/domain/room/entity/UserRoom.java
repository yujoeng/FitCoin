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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wall_item")
    private Furniture wallItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_item")
    private Furniture floorItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "window_item")
    private Furniture windowItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "left_item")
    private Furniture leftItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "right_item")
    private Furniture rightItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hidden_item")
    private Furniture hiddenItem;

    public static UserRoom of(User user) {
        UserRoom room = new UserRoom();
        room.user = user;
        return room;
    }
}
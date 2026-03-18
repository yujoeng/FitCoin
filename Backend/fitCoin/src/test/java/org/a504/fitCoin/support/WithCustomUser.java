package org.a504.fitCoin.support;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @WebMvcTest 컨트롤러 테스트에서 CustomUserDetails를 principal로 주입하기 위한 커스텀 보안 컨텍스트 애노테이션.
 *
 * <p>Spring Security Test의 기본 @WithMockUser는 principal을 {@code User} 타입으로 설정하기 때문에,
 * 컨트롤러에서 {@code @AuthenticationPrincipal CustomUserDetails}로 주입 시 타입 불일치로 null이 반환된다.
 * 이 애노테이션은 {@link WithCustomUserSecurityContextFactory}를 통해 실제 {@code CustomUserDetails} 객체를
 * SecurityContextHolder에 직접 설정하여 해당 문제를 해결한다.</p>
 *
 * <p>또한 {@code @WebMvcTest}에서 Spring Security Test가 CSRF를 기본 활성화하므로,
 * POST/PUT/DELETE 등 non-GET 요청에는 반드시 {@code .with(csrf())}를 함께 사용해야 한다.</p>
 *
 * <pre>{@code
 * @Test
 * @WithCustomUser
 * void test() throws Exception {
 *     mockMvc.perform(post("/endpoint").with(csrf()))
 *            .andExpect(status().isOk());
 * }
 * }</pre>
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithCustomUserSecurityContextFactory.class)
public @interface WithCustomUser {
    long userId() default 1L;
    String email() default "test@test.com";
}

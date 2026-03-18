package org.a504.fitCoin.support;

import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

/**
 * {@link WithCustomUser} 애노테이션에 대응하는 SecurityContext 생성 팩토리.
 *
 * <p>{@code CustomUserDetails.forJwt()}로 생성한 인증 객체를 SecurityContextHolder에 직접 설정한다.
 * 이 방식은 SessionCreationPolicy.STATELESS 환경에서도 동작한다.
 * (세션 기반 post processor와 달리 SecurityContextHolder를 직접 조작하기 때문)</p>
 */
public class WithCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithCustomUser annotation) {
        CustomUserDetails userDetails = CustomUserDetails.forJwt(annotation.email(), annotation.userId());
        UsernamePasswordAuthenticationToken auth = UsernamePasswordAuthenticationToken.authenticated(
                userDetails, null, userDetails.getAuthorities()
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        return context;
    }
}

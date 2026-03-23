import React from 'react';

interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 * 이미지 로드 실패 시 /icons/error.png를 보여주는 공통 이미지 컴포넌트
 */
export default function AppImage({ src, alt, onError, ...props }: AppImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        e.currentTarget.src = '/icons/error.png';
        if (onError) {
          // 추가적인 에러 핸들링이 필요한 경우 호출
          (onError as any)(e);
        }
      }}
      {...props}
    />
  );
}

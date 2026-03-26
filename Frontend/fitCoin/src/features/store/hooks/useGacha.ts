// src/features/store/hooks/useGacha.ts
// 뽑기 API 호출 및 결과/로딩/에러 상태를 관리하는 커스텀 훅

import { useState } from 'react';
import {
    gachaFurniturePoint,
    gachaFurnitureCoin,
    gachaGifticon,
    rerollCharacter,
} from '@/features/store/services/storeApi';
import {
    GachaType,
    GachaResult,
} from '@/features/store/types/types';

const useGacha = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GachaResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const executeGacha = async (type: GachaType) => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            let response;

            if (type === 'furniture-point') {
                response = await gachaFurniturePoint();
            } else if (type === 'furniture-coin') {
                response = await gachaFurnitureCoin();
            } else if (type === 'CHARACTER_REROLL') {
                response = await rerollCharacter();
            } else {
                response = await gachaGifticon();
            }

            if (response.isSuccess && response.result) {
                setResult(response.result);
            } else {
                setError(response.message);
            }
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { message?: string } } };
                setError(axiosErr.response?.data?.message || '뽑기에 실패했어요. 다시 시도해주세요.');
            } else {
                setError('뽑기에 실패했어요. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearResult = () => {
        setResult(null);
        setError(null);
    };

    return { isLoading, result, error, executeGacha, clearResult };
};

export default useGacha;
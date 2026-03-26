'use client';

import { useState, useEffect } from 'react';
import StoreView from '@/views/StoreView';
import type { UserCharacter } from '@/types/home';
import { useAssets } from '@/features/wallet/hooks/useAssets';
import { getCharacterMe } from '@/features/user/services/userApi';

export default function StorePage() {
    const { assets, fetchData } = useAssets();
    const points = assets?.point ?? 0;
    const coins = assets?.coin ?? 0;

    const [character, setCharacter] = useState<UserCharacter | null>(null);

    useEffect(() => {
        const fetchCharacter = async () => {
            const data = await getCharacterMe();
            if (data) {
                setCharacter({
                    id: String(data.characterId),
                    characterTypeId: String(data.characterId),
                    name: '',
                    exp: data.currentExp,
                    stage: 1,
                    isGraduatable: data.isGraduatable,
                    imageSrc: data.imgUrl,
                });
            }
        };
        fetchCharacter();
    }, []);

    return (
        <StoreView
            points={points}
            coins={coins}
            character={character}
            onUpdateAssets={fetchData}
        />
    );
}
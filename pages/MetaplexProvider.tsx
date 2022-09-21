import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { FC, ReactElement } from 'react';

import { MetaplexContext } from './useMetaplex';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

interface Props {
    children: ReactElement;
}

export const MetaplexProvider: FC<Props> = ({ children }) => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const metaplex = useMemo(() => {
        if (wallet.connected) {
            return Metaplex.make(connection).use(walletAdapterIdentity(wallet));
        }
    }, [connection, wallet.connected]);

    return (
        <MetaplexContext.Provider value={{ metaplex }}>
            {children}
        </MetaplexContext.Provider>
    );
};

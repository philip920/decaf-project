import { useMemo, FC } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { MetaplexProvider } from './MetaplexProvider';
import Nfts from './Nfts';
import { Grid } from '@mui/material';

const Home: FC = () => {
    const solNetwork = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [solNetwork]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <MetaplexProvider>
                        <Grid
                            sx={{
                                minHeight: '100vh',
                                padding: '4rem 0',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyCntent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <WalletMultiButton />
                            <Nfts />
                        </Grid>
                    </MetaplexProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Home;

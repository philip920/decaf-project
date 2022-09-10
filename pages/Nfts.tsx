import { useMetaplex } from './useMetaplex';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Grid } from '@mui/material';

// I only typed the properties that are necessary for this project. "[x: string | number | symbol]: unknown;" allows for multiple other unknown properties
interface Nft {
    name: string;
    image: string;
    [x: string | number | symbol]: unknown;
}

interface NftMetaData {
    uri: string;
    [x: string | number | symbol]: unknown;
}

const Nfts = () => {
    const [loading, setLoading] = useState(true);
    const [nfts, setNfts] = useState<Nft[]>([]);
    const { metaplex } = useMetaplex();
    const wallet = useWallet();

    const fetchUri = async (uri: string): Promise<Nft> => {
        try {
            const res = await fetch(uri);
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNfts = async (allMetaData: NftMetaData[]): Promise<void> => {
        try {
            const nfts = await Promise.all(
                allMetaData.map((metaData) => fetchUri(metaData.uri))
            );
            setNfts(nfts);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getMetaData = async (): Promise<void> => {
            try {
                const allMetaData = await metaplex
                    .nfts()
                    .findAllByOwner({ owner: metaplex.identity().publicKey })
                    .run();
                await fetchNfts(allMetaData);
            } catch (error) {
                console.log(error);
            }
        };

        wallet.connected && getMetaData();
    }, [wallet.connected]);

    return (
        wallet.connected && (
            <div>
                {loading && <h3>Loading...</h3>}
                <Grid
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-around',
                        overflow: 'hidden',
                    }}
                >
                    {nfts.length > 1 &&
                        !loading &&
                        nfts.map((nft) => (
                            <Card
                                sx={{
                                    maxWidth: 500,
                                    margin: 5,
                                }}
                            >
                                <CardActionArea>
                                    <CardMedia
                                        component='img'
                                        height={500}
                                        image={nft.image}
                                        alt='pic'
                                    />
                                    <CardContent
                                        sx={{ backgroundColor: '#1b1b1b' }}
                                    >
                                        <Typography
                                            sx={{
                                                color: '#ffffff',
                                                fontFamily: 'DM Sans',
                                            }}
                                            variant='h6'
                                            component='div'
                                        >
                                            {nft.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                </Grid>
            </div>
        )
    );
};

export default Nfts;

import { useMetaplex } from './useMetaplex';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Grid } from '@mui/material';

const Nfts = () => {
    const [loading, setLoading] = useState(true);
    const [nfts, setNfts] = useState([]);
    const { metaplex } = useMetaplex();
    const wallet = useWallet();

    const fetchUri = async (uri: string) => {
        try {
            const res = await fetch(uri);
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNfts = async (nfts) => {
        const images = await Promise.all(nfts.map((nft) => fetchUri(nft.uri)));
        setNfts(images);
        setLoading(false);
    };

    useEffect(() => {
        const getMetaData = async () => {
            const nfts = await metaplex
                .nfts()
                .findAllByOwner({ owner: metaplex.identity().publicKey })
                .run();

            await fetchNfts(nfts);
        };

        wallet.connected && getMetaData().catch(console.error);
    }, [wallet.connected]);

    return (
        wallet.connected && (
            <div>
                {loading && <h3>Loading...</h3>}
                <Grid
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
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
                                    borderColor: '#ffffff',
                                }}
                            >
                                <CardActionArea>
                                    <CardMedia
                                        component='img'
                                        // height={500}
                                        height={500}
                                        image={nft.image}
                                        alt='green iguana'
                                    />
                                    <CardContent
                                        sx={{ backgroundColor: '#1b1b1b' }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'white',
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

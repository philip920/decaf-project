import { useMetaplex } from './useMetaplex';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

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
                {nfts.length > 1 &&
                    !loading &&
                    nfts.map((nft) => (
                        <div>
                            <h1>{nft.name}</h1>
                            <img
                                src={nft.image}
                                alt='pic'
                            />
                        </div>
                    ))}
            </div>
        )
    );
};

export default Nfts;

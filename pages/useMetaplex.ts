import { createContext, useContext } from 'react';

interface MetaplexContext {
    metaplex: any;
}

const DEFAULT_CONTEXT = {
    metaplex: null,
};

export const MetaplexContext = createContext<MetaplexContext>(DEFAULT_CONTEXT);

export const useMetaplex = () => {
    return useContext(MetaplexContext);
};

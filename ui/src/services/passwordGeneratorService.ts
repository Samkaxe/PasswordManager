const passwordGeneratorService = {
    generate: (length = 12) => {
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
    },
};

export default passwordGeneratorService;
function asyncImport(path) {
    return import(path).then(result => {
        const stuff = result;

        return stuff;
    }) 
}

export default asyncImport;

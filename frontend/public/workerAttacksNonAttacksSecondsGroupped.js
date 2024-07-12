self.onmessage = ({ data: predictions }) => {
    const aux = new Map()

    predictions.forEach((p) => {
        const dateTimeSeconds = p.createdDate.split('.')[0];
        aux.set(dateTimeSeconds, (aux.get(dateTimeSeconds) || 0) + 1);
    });
    
    self.postMessage([...aux.entries()]);
}
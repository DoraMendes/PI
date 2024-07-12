self.onmessage = ({ data: predictions }) => {
    const aux = new Map()
    predictions.forEach((p) => {
        const seconds = Number(p.createdDate.split("T")[1].split(":")[2].split('.')[0]);
        const lastRecord = aux.get(p.attackType)?.at(-1)?.at(-1) || 60;
        if (!p.attackType) return;

        let elapsedSeconds = seconds - lastRecord;
        if (elapsedSeconds < 0) elapsedSeconds = -elapsedSeconds + (lastRecord - seconds);

        if (elapsedSeconds < 30) {
            aux.get(p.attackType).at(-1).push(seconds)
        } else {
            if (aux.get(p.attackType)) {
                aux.get(p.attackType).push([seconds])
            } else {
                aux.set(p.attackType, [[seconds]])
            }
        }
    });
    self.postMessage([...aux.entries()]);
}
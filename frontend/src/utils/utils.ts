export const getAttackType = (attackNumber: number) => {
    const attackNumberToName: Record<number, string> = {
        0:' Normal',
        1: 'Apache Killer',
        2: 'RUDY',
        3: 'Slow Read',
        4: 'Slow Loris',
        5: 'ARP Spoofing',
        6: 'CAM Overflow',
        7: 'MQTT Malaria',
        8:' Network Scanning',
    };

    return attackNumberToName[attackNumber];
}

export const randomDate = (start, end)  => {
    var date = new Date(+start + Math.random() * (end - start));
    return date;
}

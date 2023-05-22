
export function getNewUUID() {
    return ('10000000-1000-1000-8000-100000000000').replace(/[018]/g, (char:any) => (
        char ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (char / 4)))).toString(16)
    );
}

export function getStrFromDate(d: Date) {
    if(!d) return '';
    const addZero = (num) => { return num >= 10 ? num : '0' + num.toString() }
    return `${addZero(d.getMonth()+1)}-${addZero(d.getDate())}-${d.getFullYear()}`
}
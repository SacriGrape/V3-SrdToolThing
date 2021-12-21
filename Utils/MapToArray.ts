export function MapToArray<K, V>(map: Map<K, V>): [K, V][] {
    let array = []
    for (let [key, value] of map) {
        array.push([key, value])
    }
    return array
}
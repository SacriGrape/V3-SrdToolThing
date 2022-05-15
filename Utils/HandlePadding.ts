export function handlePadding(value: number): number {
    if (value % 16 != 0) {
        var remainder = value % 16
        while (remainder != 0) {
            value++
            remainder = value % 16
        }
    }
    return value
}
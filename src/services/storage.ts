export const storageService = {
    get(key: string): any | null {
        const rawValue = localStorage.getItem(key)

        if (!rawValue) return null

        try {
            return JSON.parse(rawValue)
        } catch (e) {
            return rawValue
        }
    },
    set(key: string, value: any): void {
        let jsonValue = value
        if (typeof value !== 'string') {
            jsonValue = JSON.stringify(value)
        }

        localStorage.setItem(key, jsonValue)
    },
    
    remove(key: string): void {
        localStorage.removeItem(key)
    }
}
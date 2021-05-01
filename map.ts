export const keys = <T>(t: T): Array<keyof T> => (t && typeof t === "object" ? (Object.keys(t) as any) : [])
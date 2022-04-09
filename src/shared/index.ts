// 重命名了Object.assign
export const extend = Object.assign

export const isObject = (val) => {
    return val !== null && typeof val === "object"
}

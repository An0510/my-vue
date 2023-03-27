// 重命名了Object.assign
export const extend = Object.assign

export const isObject = (val) => {
    return val !== null && typeof val === "object"
}

// 判断新旧值是否发生改变
export const hasChanged = (val, newVal) => {
   return !Object.is(val, newVal)
}
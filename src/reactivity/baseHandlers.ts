// 抽离出get的逻辑
import {track, trigger} from "./effect";
import {isReactive, isReadonly} from "./reactive";

// 这样只在初始化时调用一次,不需要每次都重复调用createGetter/createSetter
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadOnly=false){
    return function get(target, key) {
        const res = Reflect.get(target, key)
        if(key==='__v_isReactive'){
            // 当获取__v_isReactive时,根据isReadOnly来判断是否是Reactive数据,可以理解为readonly优先级比reactive高
            return !isReadOnly
        } else if(key==='__v_isReadonly'){
            return isReadOnly
        }
        // 非只读状态下需要收集依赖
        if(!isReadOnly){
            // TODO 依赖收集
            track(target, key)
        }
        return res
    }
}
// 抽离出set的逻辑
function createSetter(){
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)

        // TODO 触发依赖
        trigger(target, key)
        return res
    }
}
export const mutableHandlers = {
    get,
    set
}
export const readonlyHandlers = {
    get:readonlyGet,
    set(target,key,value){
        console.warn(`key ${key} set失败因为target是readonly的`)
        return true
    }
}


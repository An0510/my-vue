import {track, trigger} from "./effect";
import {mutableHandlers, readonlyHandlers, shallowReadonlyHandlers} from "./baseHandlers";

// 利用枚举
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}

export function reactive(raw) {
    return new Proxy(raw, mutableHandlers)
}

export function readonly(raw) {
    return new Proxy(raw, readonlyHandlers)
}

export function shallowReadonly(raw){
    return new Proxy(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
    // 两次!!强转成boolean值,有可能数据上未挂载该属性
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}


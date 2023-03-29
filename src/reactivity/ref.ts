import {isTracking, trackEffects, triggerEffect} from "./effect";
import {hasChanged, isObject} from "../shared";
import {reactive} from "./reactive";

class  RefImpl {
    private _rawValue: any; // 用以做hasChanged对比
    private _value: any
    public _v_isRef = true // 标识ref类型
    // ref只有一个value，所以只需要dep就可以
    public dep
    constructor(value) {
        this._rawValue = value
        // ! value如果为对象变为reactive
        this._value = convert(value)
        this.dep = new Set()
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newValue) {
        // 如果设置的值和上次相同，则不触发依赖
        if(!hasChanged(newValue,this._rawValue)) {
            return
        }
        this._rawValue = newValue
        // 依赖触发
        this._value = convert(newValue)
        triggerEffect(this.dep)
    }
    
}
export function trackRefValue(ref) {
    if(isTracking()) {
        trackEffects(ref.dep) 
    }
}

export function convert(value) {
    return isObject(value) ? reactive(value) : value
}

export function ref(value) {
    return new RefImpl(value)
}

export function isRef(ref) {
    return !!ref._v_isRef
}

export function unRef(ref) {
    return ref._v_isRef ? ref.value : ref
}

export function proxyRefs(objectWithRef) {
    return new Proxy(objectWithRef, {
        // get => age(ref)返回.value
        // not ref => value
        get(target,key) {
            return unRef(Reflect.get(target,key))
        },
        // set => ref.value
        set(target,key,value){
            if(isRef(target[key]) && !isRef(value)) {
                return target[key].value = value
            } else {
                return Reflect.set(target,key,value)
            }
        }
    })
}
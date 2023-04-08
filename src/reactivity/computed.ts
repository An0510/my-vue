import {ReactiveEffect} from "./effect";

class ComputedRefImpl {
    private _getter: any
    private _effect: any
    private _dirty: boolean = true
    private _value: any
    constructor(getter) {
        this._getter = getter
        this._effect = new ReactiveEffect(getter, () => {
            if(!this._dirty) {
                this._dirty = true
            }
        })
    }
    // 当依赖的响应式对象值发生改变时，dirty变为ture，也就是需要重新触发computed中的getter
    // 利用effect
    get value() {
        if(this._dirty) {
            this._dirty = false
            this._value = this._effect.run()
        }
        return this._value
    }
}

export function computed (getter) {
    return new ComputedRefImpl(getter)
}
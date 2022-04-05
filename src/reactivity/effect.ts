import {extend} from "../shared";

const targetMap = new Map()
// 为了将run方法中的effect中fn传递给track函数
let activeEffect
let shouldTrack

//? 依赖类
class ReactiveEffect {
    deps = []
    active = true
    onStop?: () => void

    // 可选用?
    constructor(public fn, public scheduler?) {

    }

    run() {
        // !这一步回去收集依赖 用shouldTrack做区分
        // !当stop时,fn中shouldTrack为false,不做收集
        if (!this.active) {
            return this.fn()
        }
        // !非stop时,fn中shouldTrack为true
        shouldTrack = true
        activeEffect = this

        const result = this.fn()
        // reset 全局变量 重置为false
        shouldTrack = false
        return result
    }

    stop() {
        // 通过实例上的active 避免重复stop
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

// 删除当前effect
function cleanupEffect(effect) {
    const { deps } = effect
    if(deps.length){
        deps.forEach(dep => {
            // 删掉当前的effect
            dep.delete(effect)
        })
        deps.length = 0
    }
}

export function effect(fn, options: any = {}) {
    // 拿到scheduler
    const scheduler = options.scheduler
    // fn 传入scheduler 往实例上绑scheduler属性
    const _effect = new ReactiveEffect(fn, scheduler)
    // extend就是重命名了Object.assign
    // 把options放到_effect上
    extend(_effect, options)

    // 初始化时先run一次,
    _effect.run()
    // effect 返回 runner函数 直接获取run是没有this的,用bind以当前的effect实例作为this
    const runner = _effect.run.bind(_effect)
    // runner上挂上了effect,为了stop去调用
    runner.effect = _effect

    return runner
}

function isTracking(){
    // 避免activeEffect为undefined的情况(也就是没有effect单纯一个reactive对象触发get和track时)
    return shouldTrack&&activeEffect!==undefined
}

//? 收集依赖
export function track(target, key) {
    if(!isTracking()) return
    // target -> key -> dep
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap) // targetMap:{target : depsMap}
    }
    let dep = depsMap.get(key) // set {}
    // 如果没有dep 新建dep并更新depsMap
    if (!dep) {
        dep = new Set() // set {}
        depsMap.set(key, dep) // depsMap {key: set{}}
    }
    trackEffects(dep);
}

export function trackEffects(dep) {
    if (!dep.has(activeEffect)) {
        // 向dep中添加activeEffect 依赖实际上就收集到了targetMap中
        dep.add(activeEffect)
        // 让每个activeEffect上存储dep依赖,反向，这样就可以在effect上拿到dep，便于stop
        activeEffect.deps.push(dep)
    }
}

//? 触发依赖 更新依赖
export function trigger(target, key) {
    // 从全局变量depsMap中拿到对应target对应key的
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    // 将所有依赖遍历执行
    for (const effect of dep) {
        // 当effect上绑着scheduler时,执行scheduler函数
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

// 停止依赖
export function stop(runner) {
    // 执行ReactiveEffect实例上的run方法
    runner.effect.stop()
}

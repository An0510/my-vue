// 全局,用于获取依赖
const targetMap = new Map()
// 为了将run方法中的effect中fn传递给track函数
let activeEffect = void 0
//? 依赖类
class ReactiveEffect{
    constructor(public fn) {

    }
    run(){
        activeEffect = this
        return this.fn()
    }
}

export function effect(fn){
    // fn
    const _effect = new ReactiveEffect(fn)

    _effect.run()
    // effect 返回 runner 直接获取run是没有this的,用bind以当前的effect实例作为this
    return _effect.run.bind(_effect)
}

//? 收集依赖
export function track(target,key){
    // target -> key -> dep
    let depsMap = targetMap.get(target)
    if (!depsMap){
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    let dep = depsMap.get(key)
    // 如果没有dep 新建dep并更新depsMap
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }
    // 依赖实际上就收集到了targetMap中
    dep.add(activeEffect)
}
//? 触发依赖 更新依赖
export function trigger(target, key){
    // 从全局变量depsMap中拿到对应target对应key的
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    // 将所有依赖遍历执行
    for (const effect of dep) {
        effect.run()
    }
}

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    }
    
    return component
}

export function setupComponent(instance) {
    //TODO 
    // initProps()
    // initSlots()
    setupStatefulComponent(instance)
}
// 有状态的组件 反面是函数组件
function setupStatefulComponent(instance) {
    const Component = instance.type
    const { setup } = Component
    if(setup) {
        const setupResult = setup()
        
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult) {
    // function Object
    // TODO function
    if(typeof setupResult === "object") {
        instance.setupState = setupResult
    }
    
    finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
    const Component = instance.type
    if(!Component.render) {
        instance.render = Component.render
    }
}
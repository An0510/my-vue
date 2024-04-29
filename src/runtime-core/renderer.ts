import {createComponentInstance, setupComponent} from "./component";

export function renderer(vnode, rootContainer) {
    // patch
    patch(vnode, rootContainer)
}

function patch(vnode, rootContainer) {
    // 处理组件
    processComponent(vnode, rootContainer)
}

function processComponent(vnode, rootContainer) {
    mountComponent(vnode, rootContainer)
    
}

function mountComponent(vnode, rootContainer) {
    // 组件实例
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, rootContainer)
}

function setupRenderEffect(instance, rootContainer) {
    const subTree = instance.render()
    // vnode -> patch
    // vnode => element => mountElement
    patch(subTree, rootContainer)
    
}


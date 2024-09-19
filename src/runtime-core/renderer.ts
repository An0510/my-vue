import { createComponentInstance, setupComponent } from "./component";
import { isObject } from "../shared";

export function render(vnode, container) {
    // patch
    patch(vnode, container)
}

// 判断vnode是element还是component
function patch(vnode, container) {
    // processElement(vnode, container)

    if (typeof vnode.type === "string") {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const element = vnode.el = document.createElement(vnode.type)

    const { children } = vnode
    if (typeof children === "string") {
        element.textContent = children
    } else if (children instanceof Array) {
        mountChildren(vnode, element)
    }
    const { props } = vnode
    for (const key in props) {
        const value = props[key]
        element.setAttribute(key, value)
    }
    console.log(container)
    container.append(element)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(childNode => patch(childNode, container))
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)

}

function mountComponent(initailVnode, container) {
    // 组件实例
    const instance = createComponentInstance(initailVnode)
    setupComponent(instance)
    setupRenderEffect(instance, initailVnode, container)
}

function setupRenderEffect(instance, initailVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    // vnode -> patch
    // vnode => element => mountElement
    patch(subTree, container)
    // all element => mounted
	initailVnode.el = subTree.el
}


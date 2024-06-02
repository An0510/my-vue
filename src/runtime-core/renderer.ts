import {createComponentInstance, setupComponent} from "./component";
import {isObject} from "../shared";

export function render(vnode, container) {
    // patch
    patch(vnode, container)
}

// 判断vnode是element还是component
function patch(vnode, container) {
    // processElement(vnode, container)
    console.log(vnode, vnode.type)
    if (typeof vnode.type === "string") {
        processElement(vnode, container)
    } else if(isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const element = document.createElement(vnode.type)
    
    const { children } = vnode
    if(typeof children === "string") {
        element.textContent = children
    }else if(children instanceof Array) {
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

function mountChildren(vnode, container){
    vnode.children.forEach(childNode => patch(childNode, container))
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
    
}

function mountComponent(vnode, container) {
    // 组件实例
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
    const subTree = instance.render()
    // vnode -> patch
    // vnode => element => mountElement
    patch(subTree, container)
    
}


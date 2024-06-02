import {createVnode} from "./createVnode";
import {render} from "./renderer";

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成vnode
            // component => vnode 基于vnode做处理
            const vnode = createVnode(rootComponent)
            console.log('createVnode', vnode)
            render(vnode, rootContainer)
        }
    }
}
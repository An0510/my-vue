import {createVnode} from "./createVnode";
import {renderer} from "./renderer";

export function createApp(rootContainer) {
    return {
        mount(rootContainer) {
            // 先转换成vnode
            // component => vnode 基于vnode做处理
            const vnode = createVnode(rootContainer)
            
            renderer(vnode, rootContainer)
        }
    }
}
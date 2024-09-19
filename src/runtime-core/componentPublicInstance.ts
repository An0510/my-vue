export function initProxy(instance) {
  console.log('initProxy', instance)
  const map = {
    $el: (i) => {
        console.log(i)
        return i.vnode.el
    }
  }
  return new Proxy(instance, {
    get(target: any, key: string | symbol, receiver: any): any {
      const { setupState } = instance
      console.log('proxy get', target, key)
      const mapCallback = map[key]
      if( mapCallback ) {
        return mapCallback(instance)
      }
      console.log(key, setupState, setupState[key])
      return setupState[key]
    }
  })
}
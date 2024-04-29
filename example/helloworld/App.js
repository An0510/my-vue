export const App = {
  // <template></template>
  // render 
  render() {
    return h('div', '一个vnode', this.msg)
  },
  setup() {
    // composition api
    return {
      msg: 'my-vue'
    }
  }
}
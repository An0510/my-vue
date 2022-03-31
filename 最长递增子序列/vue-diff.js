// children1,children2
exports.diffArray = (c1, c2, {mountElement, patch, unmount, move}) => {
    function isSameVnodeType(n1, n2) {
        // 实际上还需要type相同以及层级相同,省略了
        return n1.key === n2.key
    }

    let i = 0 // 从左往右复用,没被复用的第一个节点下标
    const l1 = c1.length // 老节点
    const l2 = c2.length // 新节点
    // end
    let e1 = l1 - 1
    let e2 = l2 - 1
    // 1 从左往右遍历,如果节点可以复用就继续,不能就停止
    while (i <= e1 && i <= e2) {
        const n1 = c1[i]
        const n2 = c2[i]
        // 当遇到新旧相同的时候去patch,不同时就break
        if (isSameVnodeType(n1, n2)) {
            patch(n1.key, n2.key)
        } else {
            break
        }
        i++
    }
    // 2 从右往左遍历,如果节点可以复用就继续,不能就停止
    while (i <= e1 && i <= e2) {
        const n1 = c1[e1]
        const n2 = c2[e2]
        // 当遇到新旧相同的时候去patch,不同时就break
        if (isSameVnodeType(n1, n2)) {
            patch(n1.key, n2.key)
        } else {
            break
        }
        e1--
        e2--
    }
    // 3.1 老节点没了新节点还有. 12345 1234567
    if (i > e1) {
        if (i <= e2) {
            while (i <= e2) {
                const n2 = c2[i]
                mountElement(n2.key)
                i++
            }
        }
        // 3.2 老节点还有,新节点没了 12345 123
    } else if (i > e2) {
        if(i<=e1){
            while(i<=e1){
                const n1 = c1[i]
                unmount(n1.key)
                i++
            }
        }
        // 老节点还有,新节点也还有
    } else {
        // 老新元素起始位置
        const s1 = i
        const s2 = i
        // 新元素做成map key:value(index)
        const keyToNewIndexMap = new Map()
        // 遍历新元素, 存入map
        for (let i = s2; i <= e2; i++) {
            const nextChild = c2[i]
            keyToNewIndexMap.set(nextChild.key,i)
        }
        // 需要新增和更新节点的个数
        const toBePatched = e2 - s2 + 1
        // 已新增或更新节点数
        let patched = 0

        // ? 下标是新元素的相对下标,初始值是0,如果节点复用了,值是老元素的下标+1
        const newIndexToOldIndexMap = new Array(toBePatched)
        // 初始化
        for (let i = 0; i < toBePatched; i++) {
            newIndexToOldIndexMap[i] = 0
        }

        // 遍历老元素 -> 找新老无法复用部分
        // !判断是否需要移动
        let moved = false
        // !记录相对下标
        let maxNewIndexSoFar = 0
        for (let i = s1; i <= e1; i++) {
            const prevChild = c1[i]
            if(patched >= toBePatched){
                unmount(prevChild.key)
                continue
            }
            // 是否新老元素无法复用部分
            // 新元素对应下标
            const newIndex = keyToNewIndexMap.get(prevChild.key)
            if(newIndex===undefined){
                unmount(prevChild.key)
            } else { // 新的里面有老的,节点要复用
                // 当乱序时,就需要移动,顺序时则不会
                if(newIndex >= maxNewIndexSoFar) {
                    maxNewIndexSoFar = newIndex
                } else {
                    moved = true
                }
                //  ! 无法复用部分的相对位置,反过来可以用于证明新节点是否被复用
                newIndexToOldIndexMap[newIndex-s2] = i + 1
                patch(prevChild.key)
                patched++
            }
        }
        // 最长递增子序列 返回不需要移动(新元素)的下标 判断是否需要move
        // getSequence(newIndexToOldIndexMap) 传入
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
        // 获取最后一个元素下标
        let lastIndex = increasingNewIndexSequence.length-1
        // 遍历新元素,从右往左 -> move mount
        for (let i = toBePatched-1; i >= 0; i--) {
            // 拿到当前节点 新节点数组中无法复用的末尾
            const nextChildIndex = s2 + i
            const nextChild = c2[nextChildIndex]

            // 判断节点是不是mount
            // newIndexToOldIndexMap是用于判断新节点是否被复用
            // ! 当新节点没被复用时,代表是新增
            if(newIndexToOldIndexMap[i]===0){
                mountElement(nextChild.key)
            } else {
                //? move c d e -> e c d 尽可能减少移动
                // 需要借助newIndexToOldIndexMap key:新元素相对下标 value:老元素下标+1
                // 找到数组的最长递增子序列,已最小成本减少移动
                // 当没有不需要移动的数(lastIndex < 0),或是当前新元素序列和稳定序列(最长递增子序列)不等时,需要move
                if(lastIndex < 0 || i!==increasingNewIndexSequence[lastIndex]){
                    move(nextChild.key)
                } else {
                    lastIndex--
                }
            }
        }
    }

    function getSequence(arr){
        // 肯定不是空数组,初始值为0
        const lis = [0] // 最长递增子序列路径[数组下标]
        const len = arr.length
        const recordIndexOfI = arr.slice() // 拷贝一个新数组,用于纠正lis用
        for (let i = 0; i < len; i++) {
            let arrI = arr[i]
            // arr[i]为0时代表新节点未被复用,也就是说不在老节点中是新增的,因此不在lis中
            if(arrI!==0){
                // 新增的需要判断插入lis的哪里 当前最大的数
                const last = lis[lis.length - 1]
                // 如果新来的arrI大于当前最大的数
                if(arr[last]<arrI){
                    // 记录第i次时本来的元素是什么
                    recordIndexOfI[i] = last
                    // 插入到当前数组
                    lis.push(i)
                    continue
                }
                // 如果小于等于last时
                // lis是一个递增有序数组 用二分查找插入元素
                let left = 0,
                    right = lis.length - 1
                while (left<right){
                    // >> 除二向下取整
                    const mid = (left+right) >> 1
                    if(arr[lis[mid]] < arrI){
                        left = mid + 1
                    } else {
                        right = mid
                    }
                }
                // 利用贪心的思想,每次添加的arrI,如果不是大于所有元素,就尽可能去替换掉比arrI大的元素中最小的那个
                // 3 -> 1 2 4 5 => 1 2 3 5
                // 也就是当arrI对应arr元素小于arr中比他大的最小元素时 进行替换
                if(arrI < arr[lis[left]]){
                    // 从lis中找到了比arrI大的元素里最小的那个，即arr[lis[left]]。
                    // 否则则没有找到比arrI大的元素，就不需要做什么了
                    if(left>0){
                        // 记录第i次时,上次的元素是什么,用于后面回溯
                        recordIndexOfI[i] = lis[left - 1]
                    }
                    lis[left] = i
                }
            }
        }
        // 遍历lis纠正位置
        let i = lis.length
        let last = lis[i - 1]
        // 在新插入和贪心替换的时候记录
        while(i-- > 0){
            // 从倒数第二个开始
            lis[i] = last
            // recordIndexOfI就是第i次变化的值
            last = recordIndexOfI[last]
        }
        return lis
    }


}
// 在源码中mountElement是放在patch中的,为了方便测试,拆出来了这么一个函数.
// patch 复用元素
// unmount 删除元素
// move 移动元素



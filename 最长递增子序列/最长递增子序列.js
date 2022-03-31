const lengthOfLIS1 = (nums) => {
    const n = nums.length
    if (n <= 1) {
        return n
    }
    const dp = new Array(n).fill(1)
    let max = 1
    for (let i = 1; i < n; i++) {
        // 和i之前的挨个进行比较
        for (let j = i - 1; j >= 0; j--) {
            // 若当前值大于nums[j] 则当前dp[i]就要取最大的值
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1)
            }
        }
    }
    return Math.max(...dp)
}
// const lengthOfLIS = (nums) => {
//     const n = nums.length
//     if (n <= 1) {
//         return n
//     }
//     const dp = [null, nums[0]]
//     let max = 1
//     for (let i = 1; i < n; i++) {
//         console.log(dp)
//         // 如果当前nums[i]大于dp数组中最大的也就是最后一位
//         // 将nums[i]推入dp并更新max值
//         if (dp[max] < nums[i]) {
//             // max = max+1
//             dp[++max] = nums[i]
//             continue
//         }
//         // 当当前nums[i]小于dp最后一位时
//         // 二分查找(dp是有序数组)
//         // 在dp中找到比nums[i]小且最接近的,然后用nums[i]替换掉dp[pos]的值
//         let pos = 0,
//             left = 1,
//             right = max,
//             mid
//         while (left <= right) {
//             // 效果和Math.floor((left+right)/2)相同,是向下取整的
//             mid = (left + right) >> 1
//             if (nums[i] > dp[mid]) {
//                 //元素在右侧
//                 left = mid + 1
//                 pos = mid
//             } else {
//                 right = mid - 1
//             }
//         }
//         dp[pos + 1] = nums[i]
//     }
//     return max
// }
// console.log(lengthOfLIS([0, 1, 0, 4, 5, 3]));

const lengthOfLIS3 = (nums) => {
    const n = nums.length
    if (n <= 1) {
        return n
    }
    const dp = [null, nums[0]]
    let max = 1
    const result = []
    const prevIndex = []
    for (let i = 1; i < n; i++) {
        console.log(dp)
        // 如果当前nums[i]大于dp数组中最大的也就是最后一位
        // 将nums[i]推入dp并更新max值
        if (dp[max] < nums[i]) {
            // max = max+1
            dp[++max] = nums[i]
            continue
        }
        // 当当前nums[i]小于dp最后一位时
        // 二分查找(dp是有序数组)
        // 在dp中找到比nums[i]小且最接近的,然后用nums[i]替换掉dp[pos]的值
        let pos = 0,
            left = 1,
            right = max,
            mid
        while (left <= right) {
            // 效果和Math.floor((left+right)/2)相同,是向下取整的
            mid = (left + right) >> 1
            if (nums[i] > dp[mid]) {
                //元素在右侧
                left = mid + 1
                pos = mid
            } else {
                right = mid - 1
            }
        }
        dp[pos + 1] = nums[i]
    }
    console.log(dp)
    while(dp.length>0){


        dp.length--
    }
}
console.log(lengthOfLIS3([0, 1]));

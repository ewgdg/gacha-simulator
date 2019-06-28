export const binarySearchLarger = function(nums, target) {
  const length = nums.length
  let left = 0
  let right = length - 1

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2)
    if (nums[mid] >= target) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
  // right index is the smaller index
  // left for larger one
  return left
}

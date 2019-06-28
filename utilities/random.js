import { binarySearchLarger } from './search'

export const nextDecimal = function(min, max) {
  // exclude max
  const range = max - min
  return Math.random() * range + min
}

export const weightedRandom = (weights) => {
  const prefixSum = []
  let sum = 0
  const min = 0
  let max = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i].weight
    prefixSum[i] = sum
  }
  max = sum
  const rand = nextDecimal(min, max)
  const found = binarySearchLarger(prefixSum, rand)
  return found
}

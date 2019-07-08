import { binarySearchLarger } from './search'

export const nextDecimal = function(min, max) {
  // exclude max
  const range = max - min
  return Math.random() * range + min
}

export const weightedRandom = (weights) => {
  // eslint-disable-next-line
  // console.log(weights)
  if (weights.some((a) => a.weight !== undefined)) {
    weights = weights.map((a) => a.weight)
  }
  const prefixSum = []
  let sum = 0
  const min = 0
  let max = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    prefixSum[i] = sum
  }
  max = sum
  const rand = nextDecimal(min, max)
  const found = binarySearchLarger(prefixSum, rand)
  return found
}

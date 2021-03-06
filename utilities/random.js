import { binarySearchLarger } from './search'

export const nextDecimal = function(min, max) {
  // exclude max
  const range = max - min
  return Math.random() * range + min
}

export const weightedRandom = (weights, isPrefixSum) => {
  // eslint-disable-next-line
  // console.log(weights)

  const min = 0
  let max = 0
  let prefixSum = []
  if (!isPrefixSum) {
    if (weights.some((a) => a.weight !== undefined)) {
      weights = weights.map((a) => a.weight)
    }
    prefixSum = []
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      prefixSum[i] = sum
    }
    max = sum
  } else {
    prefixSum = weights
    max = weights[weights.length - 1]
  }

  const rand = nextDecimal(min, max)
  const found = binarySearchLarger(prefixSum, rand)
  return found
}

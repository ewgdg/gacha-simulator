'use strict'
import { weightedRandom, nextDecimal } from '~/utilities/random'

/*
  a class represents states of a player or bot
 */
class PlayerAgent {
  constructor(name, cards, type, manager = null) {

    //top up rate determine the rate of paying of a bot for the amount generated from top up range
    let topupRates = []
    let topupRanges = []
    if (type === 'free rider') {
      topupRates = [0.33, 0.15]
      topupRanges = [[15, 30], [20, 40]]
    } else if (type === 'chive') {
      topupRates = [0.33, 0.22, 0.11, 0.1]
      topupRanges = [[15, 30], [30, 60], [60, 90], [300, 600]]
    } else if (type === 'multi') {
      topupRates = [0.65, 0.45, 0.11, 0.05, 0.001]
      topupRanges = [
        [300, 600],
        [500, 700],
        [600, 800],
        [1000, 2000],
        [5000, 10000]
      ]
    } else if (type === 'player') {
    } else {
      throw new Error('unknown agent type')
    }

    this.name = name
    this.card_weights = {}
    this.card_counter = {}
    this.baseWTP = 10
    this.cur_payment = 0
    this.cur_payFrequency = 0
    this.dailyDrawFrequency = 0
    this.balance = 0
    this.WTP = 1
    this.WTP_reverse = 0
    this.totalDraw = 0
    this.topupRates = topupRates
    this.topupRanges = topupRanges
    this.totalSpending = 0
    this.score = 0
    this.type = type
    this.initData(cards, this)
    this.manager = manager

    this.prefixSum_weights = []
    this.card_list = []
    this.estimatedDailyDraw  = 1
  }

  //the extracted info to be displayed via vuex store
  getInfo() {
    return Object.assign(
      {},
      {
        name: this.name,
        card_counter: this.card_counter,
        balance: this.balance,
        score: this.score,
        type: this.type,
        totalSpending:this.totalSpending
      }
    )
  }

  //convert it into a serializable js object
  toSerializable() {
    return Object.assign(
      {},
      {
        name: this.name,
        card_counter: this.card_counter,
        balance: this.balance,
        score: this.score,
        type: this.type,
        cur_payment: this.cur_payment,
        cur_payFrequency: this.cur_payFrequency,
        card_weights: this.card_weights,
        dailyDrawFrequency: this.dailyDrawFrequency,
        WTP: this.WTP,
        WTP_reverse: this.WTP_reverse,
        totalDraw: this.totalDraw,
        totalSpending: this.totalSpending,
        prefixSum_weights: this.prefixSum_weights,
        card_list: this.card_list,
        estimatedDailyDraw :this.estimatedDailyDraw
      }
    )
  }

  //reconstruct a new agent based on serializable obj
  static reconstruct(serializable, manager = null) {
    const res = new PlayerAgent(
      serializable.name,
      {},
      serializable.type,
      manager
    )
    Object.assign(res, serializable)
    return res
  }

  //generate an amount to be paid by this bot
  generateTopupAmount() {
    const agent = this
    const len = agent.topupRates.length
    let amount = 0
    let wtp_factor = 1
    for (let i = 0; i < len; i++) {
      const rate = agent.topupRates[i] * wtp_factor
      const range = agent.topupRanges[i]
      if (Math.random() < rate) {
        wtp_factor *= 0.6
        amount += nextDecimal(range[0], range[1])
      }
    }
    return amount
  }
  //an action to purchase gemstones
  topup(amount) {
    if (!amount) {
      amount = this.generateTopupAmount()
    }
    if (typeof process.env.gemUnitQuantity !== 'number') {
      throw new Error('gemUnitQuantity is not defined')
    }

    const gemQuantity = amount * process.env.gemUnitQuantity
    this.addBalance(gemQuantity)
    this.recordPayment(amount)
    this.addTotalSpending(amount)

    const random = Math.random()
    if (random < amount / 1200 && this.manager) {
      let fading_factor = 1 - random
      fading_factor = Math.max(0.83, fading_factor)
      this.manager.updateWeights(fading_factor, [this.type==='player'?'player1':this.name])
    }

    return amount
  }
  //get the probability mass for each card
  getCardWeights(){
    return this.card_weights
  }
  drawCards(number) {
    if (!process.env.cardCost) {
      throw new Error('cardCost is not defined')
    }
    const res = []
    if (number) {
      for (let i = 0; i < number; i++) {
        const card = PlayerAgent.nextDraw(this)
        this.addCard(card)
        this.addBalance(-process.env.cardCost)
        res.push(card)
      }
      this.increaseDrawFrequency()
    } else {
      while (this.balance >= process.env.cardCost) {
        const max = Math.floor(this.balance / process.env.cardCost)
        const number = parseInt(Math.floor(nextDecimal(0, max))) + 1
        for (let i = 0; i < number; i++) {
          const card = PlayerAgent.nextDraw(this)
          this.addCard(card)
          res.push(card)
          this.addBalance(-process.env.cardCost)
        }
        this.increaseDrawFrequency()
      }
    }
    return res
  }

  static nextDraw(agent) {
    const keys = agent.card_list
    const values = agent.prefixSum_weights
    const res = keys[weightedRandom(values, true)]
    return res
  }

  initData(cards) {
    // cards is from store modules/cards
    const list = Object.keys(cards)
    for (const card of list) {
      this.card_weights[card] = cards[card].weight
      this.card_counter[card] = 0
    }
  }

  //calculate probability mass for each card
  getUpdatedWeight(
    totalDailyDraw,
    remainingTotalDailyDraw,
    WTP_reverse_sum,
    avg_wtp,
    correctionFactor,
    correctionFactor2,
    cards,
    WTP_offset
  ) {
    if (isNaN(WTP_offset)) {
      WTP_offset = 0
    }
    /* eslint-disable */
    //wtp = willingness to pay per draw
    const WTP_ratio = (this.WTP_reverse + WTP_offset) / WTP_reverse_sum
    // the wtp ratio sum up to 1, and there is a wtp ratio for each draw, so the avg wtp_ratio = 1/totalDailyDraw = standard_ratio
    const standard_ratio = 1 / totalDailyDraw 
    let deviation = (WTP_ratio - standard_ratio) / standard_ratio
    if (Number.isNaN(deviation) || !Number.isFinite(deviation)) {
      deviation = 0
    }

    const list = Object.keys(cards)
    const ret = {}

    const calculated_deviation = deviation
    deviation = Math.min(5, deviation)
    const WTP_diff = (calculated_deviation - deviation) * standard_ratio * WTP_reverse_sum
    const agentEstimatedDailyDraw = this.estimatedDailyDraw

    //wtp offset is the offset per draw, wtp_diff is the diff per draw, calculate the total diff then distribute the diff to the remaining draws
    WTP_offset += (WTP_diff * agentEstimatedDailyDraw) / (remainingTotalDailyDraw - agentEstimatedDailyDraw)

    if (isNaN(WTP_offset)) {
      WTP_offset = 0
    }

    //assign weight for rare cards
    let sum_updated = 0
    let sum_original = 0

    //calculate card factor based on collection check on owned vs unowned
    const card_factor = this.collectionCheck(cards, avg_wtp)

    for (const card of list) {
      if (cards[card].rarity > 5) {

        ret[card] = cards[card].weight

        ret[card] *= (1 + deviation) * card_factor[card]
        ret[card] *= correctionFactor
        sum_updated += ret[card]
        sum_original += cards[card].weight
      } else if (cards[card].rarity === 5) {
        ret[card] = cards[card].weight
        ret[card] *= correctionFactor2
        sum_updated += ret[card]
        sum_original += cards[card].weight
      }
    }

    //reassign weights for the rest
    const diff = sum_updated - sum_original
    let sum_original2 = 0
    for (const card of list) {
      if (cards[card].rarity < 5) {
        sum_original2 += cards[card].weight
      }
    }
    const update_ratio = (sum_original2 - diff) / sum_original2
    for (const card of list) {
      if (cards[card].rarity < 5) {
        ret[card] = cards[card].weight * update_ratio
      }
    }

    this.card_weights = ret
    this.updatePrefixSum();

    return WTP_offset
  }

  //generate an array of prefix sum from probability mass list of cards
  //it is then used to generate a random card
  updatePrefixSum(){
    let prefixSum=0;
    let index =0;
    this.card_list = Object.keys(this.card_weights)
    for(const card of this.card_list ){
      prefixSum+=this.card_weights[card]
      this.prefixSum_weights[index]=prefixSum;
      index++;
    }
  }
  //check the collection of this agent, add more probability mass for owned cards to reduce its rate of getting unique card
  collectionCheck(cards, avg_wtp) {
    const base_factor = this.collectionCheck_baseFactor(this.WTP, avg_wtp)
    let card_factor = {}
    //for the unowned cards, decrease rate based on deviation

    let sum = 0
    let count = 0
    for (const card of Object.keys(cards)) {
      if (cards[card].rarity > 5) {
        card_factor[card] = Math.pow(base_factor, Math.min(5, this.card_counter[card]))
        sum += card_factor[card]
        count++
      }
    }

    const standard_ratio = 1 / count
    for (const card of Object.keys(card_factor)) {
      //calculate the amplification ratio such that the probability sum is still 1
      card_factor[card] = (card_factor[card] / sum) / standard_ratio
    }

    return card_factor

  }
  //helper function of collectionCheck
  collectionCheck_baseFactor(wtp, avg_wtp) {
    const x = wtp
    let ratio = (-(Math.pow((x - avg_wtp), 2) / (avg_wtp * avg_wtp)) * 20 + 20) / 20 * 0.33
    ratio = Math.max(0, ratio)
    ratio = Math.min(0.33, ratio)
    return ratio + 1

  }
  //WTP represent willingness to pay
  //WTP is based on payment amount and payment frequency and patience factor
  //the fading_fator is similar to the discount factor
  calculateWTP(totalDailyDraw = 1, fading_factor = 0.5) {

    let curWTP = 0
    if (this.cur_payFrequency !== 0) {
      curWTP = this.cur_payment / this.cur_payFrequency * Math.pow(0.94, this.cur_payFrequency) + this.cur_payment / 33
    }
    curWTP += this.baseWTP
    const patienceFactor = totalDailyDraw / this.dailyDrawFrequency
    if (!isNaN(patienceFactor) && Number.isFinite(patienceFactor)) {
      curWTP = curWTP * ((patienceFactor - 1) / 10 + 1)
    }
    curWTP = Math.sqrt(curWTP)
    this.WTP = this.WTP * fading_factor + (1 - fading_factor) * curWTP
    return this.WTP
  }

  setScore(score) {
    this.score = score
  }


  increaseDrawFrequency() {
    this.dailyDrawFrequency++
  }

  setAgentEstimatedDailyDraw(value) {
    this.estimatedDailyDraw = value
  }

  addBalance(quantity) {

    this.balance += quantity
  }

  recordPayment(amount) {
    const agent = this
    agent.cur_payFrequency += 1
    agent.cur_payment += amount
  }

  addCard(card) {
    const agent = this
    agent.card_counter[card] += 1
    agent.totalDraw += 1
  }

  setWTP(value) {
    this.WTP = value
  }

  setWTP_reverse(value) {
    this.WTP_reverse = value
  }

  setWeights(value) {
    this.card_weights = value
  }

  addTotalSpending(amount) {
    this.totalSpending += amount
  }

  //reset some agent data when a new day comes
  resetDay() {
    const agent = this
    agent.cur_payFrequency = 0
    agent.cur_payment = 0
    agent.dailyDrawFrequency = 0
    agent.balance += 600
  }
  getName(){
    return this.name
  }

  //calculate the final score after the game ends.
  //score is based on payment and collection of this agent
  getScore(cards) {
    const agent = this
    let score1 = 0;
    const base_spending = 128
    const total_spending = agent.totalSpending + base_spending
    score1 += 6480 / total_spending
    score1 =
      (((Math.sqrt(score1) * 10) / (Math.sqrt(score1) + 10)) *
        10 *
        agent.totalDraw) /
      (agent.totalDraw + 300)

    let score2 = 0
    let ssr_count = 0
    let sr_count = 0
    let unique_count = 0
    for (const card of Object.keys(agent.card_counter)) {
      const rarity = cards[card].rarity
      // console.log(rarity)
      const count = agent.card_counter[card]
      if (count > 0) {
        score2 += rarity * Math.pow(1.033, Math.min(count - 1, 5))
        unique_count++
      }

      if (rarity === 6 && count > 0) {
        ssr_count++
      }
      if (rarity === 5 && count > 0) {
        sr_count++
      }
    }
    score2 /= 5
    const score3 = (648 / (total_spending / ssr_count)) * 50

    const score4 = (648 / (total_spending / sr_count)) * 10

    let score5 = 0
    if (unique_count > 0) {
      score5 += (10 * unique_count) / Object.keys(agent.card_counter).length
    }

    const res =  score1 + score2 + score3 + score4 + score5
    this.score = res
    return res
  }
}

export default PlayerAgent

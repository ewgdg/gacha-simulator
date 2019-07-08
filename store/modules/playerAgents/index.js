import {
  Agent,
  nextDraw,
  getUpdatedWeight,
  calculateWTP,
  generateTopupAmount
} from '~/utilities/Agent'

import { nextDecimal } from '~/utilities/random'

export const state = () => {
  return {
    agents: {},
    id: 2,
    totalWTP: 0,
    totalDailyDraw: 0
  }
}

export const mutations = {
  addAgent(state, agent) {
    state.agents[agent.name] = agent
  },
  increaseId(state) {
    state.id++
  },
  increaseDrawFrequency(state, name) {
    state.agents[name].dailyDrawFrequency++
  },
  setTotalWTP(state, sum) {
    state.totalWTP = sum
  },
  setTotalDailyDraw(state, sum) {
    state.totalDailyDraw = sum
  },
  addBalance(state, payload) {
    const agent = state.agents[payload.name]
    agent.balance += parseInt(payload.quantity)
    if (payload.paid) {
      agent.cur_payFrequency += 1
      agent.cur_payment += payload.quantity / process.env.gemUnitQuantity
    }
  },
  addCard(state, payload) {
    const agent = state.agents[payload.name]
    agent.card_counter[payload.card] += 1
    agent.totalDraw += 1
  },
  setWTP(state, payload) {
    payload.agent.WTP = payload.value
  },
  setWeights(state, payload) {
    payload.agent.card_weights = payload.value
    console.log(payload.value)
  },
  resetDay(state, agent) {
    // agent.prev_payFrequency = agent.cur_payFrequency
    // agent.prev_payment = agent.cur_payment
    agent.cur_payFrequency = 0
    agent.cur_payment = 0
    agent.dailyDrawFrequency = 0
    agent.balance += 600
  }
}

export const actions = {
  addAgent(context, name) {
    if (!name) {
      name = 'bot' + context.state.id
      context.commit('increaseId')
    }
    const cards = context.rootGetters['modules/cards/getCards']
    const agent = new Agent(name, cards)
    context.commit('addAgent', agent)
  },
  addBalance(context, payload) {
    if (!isNaN(payload)) {
      payload = {
        name: 'player1',
        quantity: parseInt(payload),
        paid: false
      }
    }
    // eslint-disable-next-line
    // console.log(payload)
    context.commit('addBalance', payload)
  },
  addCard(context, payload) {
    const rarity = context.rootGetters['modules/cards/getCardInfo'](
      payload.card
    ).rarity

    context.commit('modules/statistics/add_rarity_count', rarity)
    context.commit('addCard', payload)
  },
  updateTotalDailyDraw(context) {
    const state = context.state
    let sum = 0
    const day = context.rootState.modules.statistics.day
    for (const agent of Object.values(state.agents)) {
      sum += Math.max(1, agent.totalDraw) / day
    }
    sum = Math.max(1, sum)
    context.commit('setTotalDailyDraw', sum)
  },
  updateTotalWTP(context) {
    const state = context.state
    const day = context.rootState.modules.statistics.day
    let sum = 0
    for (const agent of Object.values(state.agents)) {
      sum += agent.WTP * (Math.max(1, agent.totalDraw) / day)
    }
    context.commit('setTotalWTP', sum)
  },
  updateWeights: function(context, fadingFactor) {
    const agents = context.state.agents
    const cards = context.rootGetters['modules/cards/getCards']

    const day = context.rootState.modules.statistics.day
    let WTPOffset = 0

    if (!fadingFactor) {
      fadingFactor = 0.5
    }
    for (const agent of Object.values(agents)) {
      const dailyDraw = agent.totalDraw / day
      context.commit('setWTP', {
        agent: agent,
        value: calculateWTP(agent, dailyDraw, fadingFactor)
      })
    }

    context.dispatch('updateTotalDailyDraw')
    const totalDailyDraw = context.getters.getTotalDailyDraw
    context.dispatch('updateTotalWTP')
    const totalWTP = context.getters.getTotalWTP

    context.commit('modules/statistics/update_prob', null, { root: true })
    const correctionFactor =
      context.rootGetters['modules/statistics/getCorrectionFactor']
    for (const agent of Object.values(agents)) {
      const calcalatedRes = getUpdatedWeight(
        totalDailyDraw,
        totalWTP,
        correctionFactor,
        cards,
        WTPOffset,
        day,
        agent
      )
      WTPOffset = calcalatedRes.WTP_offset
      console.log('wtp ffset: ' + WTPOffset)

      context.commit('setWeights', {
        agent: agent,
        value: calcalatedRes.weights
      })
      // context.commit('resetDay', agent)
      // // topup
      // if (agent.name !== 'player1') {
      //   context.dispatch('agentTopup', agent)
      // }
    }
  },
  updateDay(context) {
    const agents = context.state.agents
    for (const agent of Object.values(agents)) {
      if (agent.name !== 'player1') {
        context.dispatch('agentDrawCard', agent)
      }
    }
    for (const agent of Object.values(agents)) {
      context.commit('resetDay', agent)
      // topup
      if (agent.name !== 'player1') {
        context.dispatch('agentTopup', agent)
      }
    }
    context.commit('modules/statistics/increaseDay', null, { root: true })
  },
  agentTopup(context, agent) {
    const amount = generateTopupAmount(agent)
    const gemQuantity = amount * process.env.gemUnitQuantity
    context.commit('addBalance', {
      name: agent.name,
      quantity: gemQuantity,
      paid: true
    })
  },
  agentDrawCard(context, agent) {
    while (agent.balance >= 600) {
      const max = agent.balance / 600
      const number = parseInt(Math.floor(nextDecimal(0, max))) + 1
      for (let i = 0; i < number; i++) {
        const card = context.getters.getNextDraw(agent.name)
        context.dispatch('addCard', { name: agent.name, card: card })
        context.commit('addBalance', {
          name: agent.name,
          quantity: -600,
          paid: false
        })
      }
      context.commit('increaseDrawFrequency', agent.name)
    }
  }
}

export const getters = {
  getTotalWTP(state) {
    return state.totalWTP
  },
  getTotalDailyDraw(state, getters, rootState, rootGetters) {
    return state.totalDailyDraw
  },
  getBalance(state) {
    return (name = 'player1') => {
      return state.agents[name].balance
    }
  },
  getMainPlayer(state) {
    return state.agents.player1
  },
  getAgent: (state) => (name) => {
    if (!name) {
      name = 'player1'
    }
    const agent = state.agents[name]
    return agent
  },
  getNextDraw: (state, getters) => (name) => {
    const agent = getters.getAgent(name)
    const res = nextDraw(agent)
    // console.log(res)
    return res
  },
  getCards: (state, getters) => (name) => {
    getters.getAgent(name)
    return getters.getAgent(name).card_counter
  },
  getAgentDailyDraw: (state, getters, rootState) => (agent) => {
    const day = rootState.modules.statistics.day
    return Math.max(1, agent.totalDraw / day)
  }
}

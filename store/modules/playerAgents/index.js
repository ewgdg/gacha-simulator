import Vue from 'vue'
import {
  BuildAgent,
  nextDraw,
  getUpdatedWeight,
  calculateWTP,
  generateTopupAmount
} from '~/utilities/Agent'
import { nextDecimal } from '~/utilities/random'

const getDefaultState = () => {
  return {
    agents: {},
    id: 2,
    totalWTP: 0,
    totalDailyDraw: 0,
    minWTP: 0,
    maxWTP: 0,
    WTP_reverse_sum: 0
  }
}
export const state = getDefaultState
export const mutations = {
  addAgent(state, agent) {
    Vue.set(state.agents, agent.name, agent)
    // state.agents[agent.name] = agent
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
  setWTP_reverse_sum(state, sum) {
    state.WTP_reverse_sum = sum
  },
  setAgentEstimatedDailyDraw(state, payload) {
    payload.agent.estimatedDailyDraw = payload.value
  },
  addBalance(state, payload) {
    const agent = state.agents[payload.name]
    agent.balance += parseInt(payload.quantity)
    // if (payload.paid) {
    //   agent.cur_payFrequency += 1
    //   agent.cur_payment += payload.quantity / process.env.gemUnitQuantity
    // }
  },
  agentRecordPayment(context, payload) {
    const agent = payload.agent
    agent.cur_payFrequency += 1
    agent.cur_payment += payload.amount
  },
  addCard(state, payload) {
    const agent = state.agents[payload.name]
    agent.card_counter[payload.card] += 1
    agent.totalDraw += 1
  },
  setWTP(state, payload) {
    payload.agent.WTP = payload.value
  },
  setMaxWTP(state, payload) {
    state.maxWTP = payload
  },
  setMinWTP(state, payload) {
    state.minWTP = payload
  },
  setWTP_reverse(state, payload) {
    payload.agent.WTP_reverse = payload.value
  },
  setWeights(state, payload) {
    payload.agent.card_weights = payload.value
    // console.log(payload.value)
  },
  resetDay(state, agent) {
    // agent.prev_payFrequency = agent.cur_payFrequency
    // agent.prev_payment = agent.cur_payment
    agent.cur_payFrequency = 0
    agent.cur_payment = 0
    agent.dailyDrawFrequency = 0
    agent.balance += 600
  },
  reset(state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  addAgent(context, name) {
    if (!name) {
      name = 'bot' + context.state.id
      context.commit('increaseId')
    }
    const cards = context.rootGetters['modules/cards/getCards']
    const agent = BuildAgent(name, cards)
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

    context.commit('modules/statistics/add_rarity_count', rarity, {
      root: true
    })
    context.commit('addCard', payload)
    if (rarity >= 5) {
      const agent = context.state.agents[payload.name]
      context.dispatch(
        'modules/messages/addMessage',
        {
          name: agent.name,
          message: `${agent.name} just got a card '${payload.card}' of rarity ${rarity}`
        },
        { root: true }
      )
    }
  },
  updateTotalDailyDraw(context) {
    const state = context.state
    let sum = 0
    for (const agent of Object.values(state.agents)) {
      sum += agent.estimatedDailyDraw
    }
    sum = Math.max(1, sum)
    context.commit('setTotalDailyDraw', sum)
  },
  updateAgentEstimatedDailyDraw(context) {
    const state = context.state
    const day = context.rootState.modules.statistics.day
    for (const agent of Object.values(state.agents)) {
      let agentEstimatedDailyDraw = 1
      if (day > 0) {
        agentEstimatedDailyDraw = Math.max(1, agent.totalDraw / day)
      }
      context.commit('setAgentEstimatedDailyDraw', {
        agent: agent,
        value: agentEstimatedDailyDraw
      })
    }
  },
  updateTotalWTP(context) {
    const state = context.state
    let sum = 0
    let max = 0
    let min = Object.values(state.agents)[0].WTP
    for (const agent of Object.values(state.agents)) {
      max = Math.max(max, agent.WTP)
      min = Math.min(min, agent.WTP)
      sum += agent.WTP * agent.estimatedDailyDraw
    }
    context.commit('setTotalWTP', sum)
    context.commit('setMaxWTP', max)
    context.commit('setMinWTP', min)
  },
  updateWTP_reverse(context) {
    const state = context.state
    const WTP_boundary = state.minWTP + state.maxWTP
    let sum = 0
    for (const agent of Object.values(state.agents)) {
      const WTP_reverse = WTP_boundary - agent.WTP
      context.commit('setWTP_reverse', { agent: agent, value: WTP_reverse })
      sum += WTP_reverse * agent.estimatedDailyDraw
    }
    context.commit('setWTP_reverse_sum', sum)
  },
  updateWeights: function(context, payload) {
    const agents = context.state.agents
    const cards = context.rootGetters['modules/cards/getCards']

    // const day = context.rootState.modules.statistics.day
    let WTPOffset = 0

    let fadingFactor = 0.5
    let agent_list = Object.values(agents)
    if (payload) {
      if (payload.fadingFactor) {
        fadingFactor = payload.fadingFactor
      }
      if (payload.names && !payload.names.includes('all')) {
        agent_list = []
        for (const name of payload.names) {
          agent_list.push(agents[name])
        }
      }
    }
    for (const agent of agent_list) {
      const dailyDraw = agent.estimatedDailyDraw
      const wtp = calculateWTP(agent, dailyDraw, fadingFactor)
      if (agent.name === 'player1') {
        console.log(dailyDraw)
        console.log(wtp)
      }
      context.commit('setWTP', {
        agent: agent,
        value: wtp
      })
    }
    const totalDailyDraw = context.getters.getTotalDailyDraw

    context.dispatch('updateTotalWTP')
    context.dispatch('updateWTP_reverse')
    console.log('minWTP ' + context.state.minWTP + ' ' + context.state.maxWTP)
    const WTP_reverse_sum = context.state.WTP_reverse_sum
    context.commit('modules/statistics/update_prob', null, { root: true })
    const correctionFactor =
      context.rootGetters['modules/statistics/getCorrectionFactor']
    // console.log('calling correction factor res: ' + correctionFactor)
    // sort agent list based on WTP reverse , so that the offset can be calculated correctly
    const sorted_agents = Object.values(agents)
    sorted_agents.sort((a, b) => {
      return b.WTP_reverse - a.WTP_reverse
    })

    let remainingTotalDailyDraw = totalDailyDraw
    for (const agent of sorted_agents) {
      const calculatedRes = getUpdatedWeight(
        totalDailyDraw,
        remainingTotalDailyDraw,
        WTP_reverse_sum,
        correctionFactor,
        cards,
        WTPOffset,
        agent
      )
      WTPOffset = calculatedRes.WTP_offset
      // console.log('wtp offset: ' + WTPOffset)
      remainingTotalDailyDraw -= agent.estimatedDailyDraw

      context.commit('setWeights', {
        agent: agent,
        value: calculatedRes.weights
      })
      // context.commit('resetDay', agent)
      // // topup
      // if (agent.name !== 'player1') {
      //   context.dispatch('agentTopup', agent)
      // }
    }
  },
  updateDayBefore(context) {
    context.dispatch('updateAgentEstimatedDailyDraw')
    context.dispatch('updateTotalDailyDraw')
    // update Weights based on prev day data
    context.dispatch('updateWeights')
  },
  async updateDayAfter(context) {
    const agents = context.state.agents

    for (const agent of Object.values(agents)) {
      context.commit('resetDay', agent)
      // topup
      if (agent.name !== 'player1') {
        context.dispatch('agentTopup', agent)
        await context.dispatch('progressing', 0.5, { root: true })
      }
    }
    for (const agent of Object.values(agents)) {
      if (agent.name !== 'player1') {
        context.dispatch('agentDrawCard', agent)
        await context.dispatch('progressing', 0.5, { root: true })
        // await this.$wait(100)
      }
    }
    // update agent before increase day
    // context.commit('modules/statistics/increaseDay', null, { root: true })
  },
  agentTopup(context, payload) {
    let agent = payload
    if (payload.name) {
      agent = context.state.agents[payload.name]
    }
    let amount = payload.amount
    if (!amount) {
      amount = generateTopupAmount(agent)
    }
    const gemQuantity = amount * process.env.gemUnitQuantity
    context.dispatch('addBalance', {
      name: agent.name,
      quantity: gemQuantity,
      paid: true
    })
    context.commit('agentRecordPayment', { agent: agent, amount: amount })
    if (agent.name === 'player1') {
      context.dispatch('modules/statistics/addPlayerSpending', amount, {
        root: true
      })
    }
    context.dispatch('modules/statistics/addRevenue', amount, { root: true })
    const random = Math.random()
    if (random < amount / 1000) {
      let fading_factor = 1 - random
      fading_factor = Math.max(0.83, fading_factor)
      // console.log('fading factor ' + fading_factor)
      context.dispatch('updateWeights', {
        fadingFactor: fading_factor,
        names: [payload.name]
      })
    }
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
      let agent
      if ((agent = state.agents[name])) {
        return agent.balance
      }
      return undefined
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

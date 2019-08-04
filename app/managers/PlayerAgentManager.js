import PlayerAgent from '~/app/models/PlayerAgent'

class PlayerAgentManager {
  constructor(cards, store = null) {
    this.agents = new Map()
    this.cards = cards
    this.store = store
    this.totalWTP = 0
    this.maxWTP = 0
    this.minWTP = 0
    this.WTP_reverse_sum = 0
    this.totalDailyDraw = 0
  }
  getAgentsInfo() {
    const res = {}
    for (const agent of this.agents.values()) {
      res[agent.name] = agent.getInfo()
    }
    return res
  }

  toSerializable() {
    const res = {}
    const agents = {}
    for (const key of this.agents.keys()) {
      agents[key] = this.agents.get(key).toSerializable()
    }
    Object.assign(res, {
      totalWTP: this.totalWTP,
      maxWTP: this.maxWTP,
      minWTP: this.minWTP,
      WTP_reverse_sum: this.WTP_reverse_sum,
      totalDailyDraw: this.totalDailyDraw,
      cards: this.cards
    })
    res.agents = agents
    return res
  }

  static reconstruct(serializable, store = null) {
    const res = new PlayerAgentManager([], store)
    const agents = serializable.agents
    // debugger
    for (const key of Object.keys(agents)) {
      res.agents.set(key, PlayerAgent.reconstruct(agents[key], res))
    }
    res.totalWTP = serializable.totalWTP
    res.maxWTP = serializable.maxWTP
    res.minWTP = serializable.minWTP
    res.WTP_reverse_sum = serializable.WTP_reverse_sum
    res.totalDailyDraw = serializable.totalDailyDraw
    res.cards = serializable.cards

    return res
  }

  addAgent(name, type) {
    if (!name) {
      name = 'bot' + this.agents.size
    }
    const agent = new PlayerAgent(name, this.cards, type, this)
    this.agents.set(name, agent)
  }

  recordCardsFootprintToStore(cards, agent) {
    for (const card of cards) {
      const rarity = this.cards[card].rarity
      this.store.commit('modules/statistics/add_rarity_count', rarity)
      if (rarity >= 5) {
        this.store.dispatch('modules/messages/addMessage', {
          name: agent.name,
          message: `${agent.name} just got a card '${card}' of rarity ${rarity}`
        })
      }
    }
  }

  updateTotalDailyDraw() {
    let sum = 0
    for (const agent of this.agents.values()) {
      sum += agent.estimatedDailyDraw
    }
    sum = Math.max(1, sum)
    this.totalDailyDraw = sum
  }

  updateAgentEstimatedDailyDraw() {
    const state = this.store.state
    const day = state.modules.statistics.day
    for (const agent of this.agents.values()) {
      let agentEstimatedDailyDraw = 1
      if (day > 0) {
        agentEstimatedDailyDraw = Math.max(1, agent.totalDraw / day)
      }
      agent.setAgentEstimatedDailyDraw(agentEstimatedDailyDraw)
    }
  }

  updateTotalWTP() {
    let sum = 0
    let max = 0
    let min = this.agents.values().next().WTP
    for (const agent of this.agents.values()) {
      max = Math.max(max, agent.WTP)
      min = Math.min(min, agent.WTP)
      sum += agent.WTP * agent.estimatedDailyDraw
    }
    this.totalWTP = sum
    this.maxWTP = max
    this.minWTP = min
  }

  updateWTP_reverse() {
    const WTP_boundary = this.minWTP + this.maxWTP
    let sum = 0
    for (const agent of this.agents.values()) {
      const WTP_reverse = WTP_boundary - agent.WTP
      agent.setWTP_reverse(WTP_reverse)
      sum += WTP_reverse * agent.estimatedDailyDraw
    }
    this.WTP_reverse_sum = sum
  }

  updateWeights(
    fadingFactor,
    names,
    correctionFactor = 1,
    correctionFactor2 = 1
  ) {
    const cards = this.cards

    let WTPOffset = 0

    if (!fadingFactor) {
      fadingFactor = 0.5
    }

    let agent_list
    if (names && !names.includes('all')) {
      agent_list = []
      // debugger
      for (const name of names) {
        agent_list.push(this.agents.get(name))
      }
    } else {
      agent_list = Array.from(this.agents.values())
    }

    for (const agent of agent_list) {
      const dailyDraw = agent.estimatedDailyDraw
      agent.calculateWTP(dailyDraw, fadingFactor)
    }

    const totalDailyDraw = this.totalDailyDraw

    this.updateTotalWTP()
    this.updateWTP_reverse()
    // console.log('minWTP ' + context.state.minWTP + ' ' + context.state.maxWTP)

    const WTP_reverse_sum = this.WTP_reverse_sum

    if (this.store) {
      this.store.dispatch('modules/statistics/updateData')
      correctionFactor = this.store.state.modules.statistics.correctionFactor
      correctionFactor2 = this.store.state.modules.statistics.correctionFactor2
    }

    const sorted_agents = agent_list

    sorted_agents.sort((a, b) => {
      return b.WTP_reverse - a.WTP_reverse
    })

    const avg_wtp = this.totalWTP / this.agents.size

    let remainingTotalDailyDraw = totalDailyDraw
    for (const agent of sorted_agents) {
      WTPOffset = agent.getUpdatedWeight(
        totalDailyDraw,
        remainingTotalDailyDraw,
        WTP_reverse_sum,
        avg_wtp,
        correctionFactor,
        correctionFactor2,
        cards,
        WTPOffset
      )

      // console.log('wtp offset: ' + WTPOffset)
      remainingTotalDailyDraw -= agent.estimatedDailyDraw

      // context.commit('resetDay', agent)
      // // topup
      // if (agent.name !== 'player1') {
      //   context.dispatch('agentTopup', agent)
      // }
    }
  }

  updateDayBefore() {
    this.updateAgentEstimatedDailyDraw()
    this.updateTotalDailyDraw()

    // update Weights based on prev day data
    this.updateWeights()
  }

  async updateDayAfter() {
    const agents = Array.from(this.agents.values())
    for (const agent of agents) {
      agent.resetDay()
      // topup
      if (agent.name !== 'player1') {
        const amount = agent.topup()

        if (this.store) {
          this.store.dispatch('modules/statistics/addRevenue', amount)
          await this.store.dispatch('progressing', 0.5)
        }
      }
    }
    for (const agent of agents) {
      if (agent.name !== 'player1') {
        const res = agent.drawCards()
        if (this.store) {
          this.recordCardsFootprintToStore(res, agent)
          await this.store.dispatch('progressing', 0.5)
        }
        // await this.$wait(100)
      }
    }
  }

  updateScores() {
    // if (process.server) {
    //   return
    // }
    // console.log(process.server + ' udpate score' + ' ')
    // console.log(context.state.agents)
    for (const agent of this.agents.values()) {
      agent.getScore(this.cards)
    }
    const sorted = Array.from(this.agents.values()).sort((a, b) => {
      return b.score - a.score
    })
    if (this.agents.get('player1')) {
      const player = this.agents.get('player1').name
      let rank = 1
      for (const agent of sorted) {
        if (agent.name === player) {
          break
        }
        rank++
      }
      if (this.store) {
        this.store.commit('modules/playerAgents/mutate', {
          path: 'playerRank',
          with: rank
        })
      }
    }
  }

  addCompensation(payload) {
    const agents = this.agents.values()
    for (const agent of agents) {
      agent.balance += payload
    }
  }
}

export default PlayerAgentManager

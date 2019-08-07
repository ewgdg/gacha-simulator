import * as Comlink from 'comlink'
import PlayerAgent from '~/app/models/PlayerAgent'
import { shuffle } from '~/utilities/shuffle'

class PlayerAgentManager {

  constructor(cards = null) {
    this.init(cards)
  }
  init(cards) {
    this.agents = new Map()
    this.cards = cards
    this.storeActions = this.initStoreActions()
    this.totalWTP = 0
    this.maxWTP = 0
    this.minWTP = 0
    this.WTP_reverse_sum = 0
    this.totalDailyDraw = 0
    this.day = 0
    this.correctionFactor1 =1;
    this.correctionFactor2 =1;
    this.initStoreActions()
  }
  setCards(cards) {
    this.cards = cards
  }
  setStore(store){
    this.store = store
  }
  getAgentsInfo() {
    const res = {}
    for (const key of this.agents.keys()) {
      res[key] = this.agents.get(key).getInfo()
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
      cards: this.cards,
      day: this.day
    })
    res.agents = agents
    return res
  }
  reset() {
    this.init(this.cards)
  }
  setDay(day){
    this.day=day
  }
  setCorrectionFactor(c1,c2) {
    this.correctionFactor1=c1
    this.correctionFactor2=c2
  }

  restore(serializable = null, cards = null) {
    if (!serializable) {
      this.init(cards)
    }else{
      this.init();
      const agents = serializable.agents
      // debugger
      for (const key of Object.keys(agents)) {
        this.agents.set(key, PlayerAgent.reconstruct(agents[key], this))
      }
      this.totalWTP = serializable.totalWTP
      this.maxWTP = serializable.maxWTP
      this.minWTP = serializable.minWTP
      this.WTP_reverse_sum = serializable.WTP_reverse_sum
      this.totalDailyDraw = serializable.totalDailyDraw
      this.cards = serializable.cards
      this.day  = serializable.day
    }
  }

  addStoreAction(action, payload, type='dispatch') {
    if (!this.storeActions[type][action]) {
      this.storeActions[type][action] = []
    }
    this.storeActions[type][action].push(payload)
  }
  initStoreActions(){
    this.storeActions = {'dispatch':{},'commit':{}}
  }

  popStoreActions() {
    const res = {}
    Object.assign(res, this.storeActions)
    this.initStoreActions()
    return res
  }

  addAgent(name, type) {
    if (!name) {
      name = 'bot' + this.agents.size
    }
    let key = name
    if(type==='player'){
      key = 'player1'
    }
    const agent = new PlayerAgent(name, this.cards, type, this)
    this.agents.set(key, agent)
  }

  recordCardsFootprintToStore(cards, agent) {
    for (const card of cards) {
      const rarity = this.cards[card].rarity

      this.addStoreAction('modules/statistics/add_rarity_count', rarity,'commit')
      if (rarity >= 5) {
        this.addStoreAction('modules/messages/addMessage', {
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
    // debugger
    const day = this.day
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
    let min = 0
    let max = 0
    const agents = Array.from(this.agents.values())
    if( agents.length>0 ){
      min=agents[0].WTP
    }
    for (const agent of agents) {
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
    names
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

    const WTP_reverse_sum = this.WTP_reverse_sum

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
        this.correctionFactor1,
        this.correctionFactor2,
        cards,
        WTPOffset
      )

      remainingTotalDailyDraw -= agent.estimatedDailyDraw
    }
  }

  updateDayBefore() {
    this.updateAgentEstimatedDailyDraw()
    this.updateTotalDailyDraw()

    // update Weights based on prev day data
    this.updateWeights()
    this.day++
  }
  updateDayAfter() {
    const agents = Array.from(this.agents.values())
    shuffle(agents)
    for (const agent of agents) {
      agent.resetDay()
      // topup
      if (agent.type !== 'player') {
        const amount = agent.topup()
        this.addStoreAction('modules/statistics/addRevenue', amount,'dispatch')
        if(this.store){
          //allow parallel progressing
          this.store.dispatch('progressing',0.5)
        }else{
          this.addStoreAction('progressing', 0.5,'dispatch')
        }

      }
    }
    for (const agent of agents) {
      if (agent.type !== 'player') {
        const res = agent.drawCards()
        this.recordCardsFootprintToStore(res, agent)
        if(this.store){
          this.store.dispatch('progressing',0.5)
        }else{
          this.addStoreAction('progressing', 0.5,'dispatch')
        }
      }
    }
  }

  getAgent(name){
    const agent = this.agents.get(name)
    if(agent) {
      //send a proxy back for call back
      return Comlink.proxy(agent)
    }
    return null
  }

  updateScores() {
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

      this.addStoreAction('modules/playerAgents/mutate', {
        path: 'playerRank',
        with: rank
      },'commit')
    }
  }

  addCompensation(payload) {
    const agents = this.agents.values()
    for (const agent of agents) {
      agent.balance += payload
    }
  }
}

// export default PlayerAgentManager

Comlink.expose(PlayerAgentManager)

import { weightedRandom, nextDecimal } from '~/utilities/random'
// helper functions
function Agent(name, cards) {
  this.name = name
  this.card_weights = {}
  this.card_counter = {}
  initData(cards, this)
  this.baseWTP = 1
  // this.prev_payment = 0
  // this.prev_payFrequency = 0
  this.cur_payment = 0
  this.cur_payFrequency = 0
  this.dailyDrawFrequency = 0
  this.balance = 0
  this.WTP = 1
  this.totalDraw = 0

  this.topupRates = [0.33, 0.22, 0.11, 0.05]
  this.topupRanges = [[15, 30], [30, 60], [60, 90], [300, 600]]
}
const generateTopupAmount = (agent) => {
  const len = agent.topupRates.length
  for (let i = 0; i < len; i++) {
    const rate = agent.topupRates[i]
    const range = agent.topupRanges[i]
    if (Math.random() < rate) {
      return nextDecimal(range[0], range[1])
    }
  }
  return 0
}

const nextDraw = function(agent) {
  const keys = Object.keys(agent.card_weights)
  const values = Object.values(agent.card_weights)
  const res = keys[weightedRandom(values)]
  return res
}
const initData = function(cards, agent) {
  // cards is from store modules cards
  const list = Object.keys(cards)
  for (const card of list) {
    agent.card_weights[card] = cards[card].weight
    agent.card_counter[card] = 0
  }
}
const getUpdatedWeight = function(
  totalDailyDraw,
  totalWTP,
  correctionFactor,
  cards,
  WTP_offset,
  day,
  agent
) {
  if (isNaN(WTP_offset)) {
    WTP_offset = 0
  }
  /* eslint-disable */
  //wtp = willingness to pay per draw
  const WTP_ratio =  (agent.WTP+WTP_offset) / totalWTP
  const standard_ratio = 1 / totalDailyDraw
  let deviation = (WTP_ratio - standard_ratio) / standard_ratio
  if(Number.isNaN(deviation)|| !Number.isFinite(deviation) ){
    deviation = 0
  }

  console.log(agent.name+': '+ totalWTP+' '+agent.WTP+' '+ standard_ratio,+' '+WTP_offset)
  const list = Object.keys(cards)
  const ret ={}

  const calculated_deviation = deviation
  deviation=Math.min(0.9,deviation)
  const WTP_diff =  (calculated_deviation-deviation)*standard_ratio*totalWTP
  const agentEstimatedDailyDraw = Math.max(1,agent.totalDraw/day);

  console.log('Wp diff ' + agentEstimatedDailyDraw )
  WTP_offset += (WTP_diff*agentEstimatedDailyDraw)/(totalDailyDraw-agentEstimatedDailyDraw)

  // deviation=Math.max(-0.9999,deviation)
  console.log(agent.name+': deviation: '+ deviation )
  //assign weight for rare cards
  let sum_updated=0;
  let sum_original=0;
  for (const card of list) {
    if(cards[card].rarity>=5) {
      ret[card] = cards[card].weight * (1 - deviation) * correctionFactor
      sum_updated+=ret[card];
      sum_original+=cards[card].weight;
    }
  }

  //reassign weights for the rest
  const diff = sum_updated-sum_original;
  let sum_original2 =0;
  for (const card of list) {
    if (cards[card].rarity < 5) {
      sum_original2+=cards[card].weight;
    }
  }
  const update_ratio = (sum_original2-diff)/sum_original2
  for (const card of list) {
    if(cards[card].rarity<5) {
      ret[card] = cards[card].weight*update_ratio
    }
  }

  return {weights:ret, WTP_offset:WTP_offset};
}
const calculateWTP=function(agent,totalDailyDraw=1,fading_factor=0.5){

  let curWTP=0;
  if(agent.cur_payFrequency!==0){
    curWTP= agent.cur_payment/agent.cur_payFrequency*Math.pow(0.94, agent.cur_payFrequency)
  }
  curWTP+=agent.baseWTP;

  curWTP=Math.sqrt(curWTP)
  const patienceFactor = totalDailyDraw/agent.dailyDrawFrequency;
  if(!isNaN(patienceFactor) && Number.isFinite(patienceFactor)  ){
    curWTP=curWTP* ((patienceFactor-1)/10 +1)
  }
  return agent.WTP*fading_factor+(1-fading_factor)*curWTP;
}



export { Agent,nextDraw,getUpdatedWeight,calculateWTP,generateTopupAmount }

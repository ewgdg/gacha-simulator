import { weightedRandom, nextDecimal } from '~/utilities/random'

// helper functions
function BuildAgent(name, cards) {
  const agent = {
    name: name,
    card_weights: {},
    card_counter: {},
    baseWTP: 10,
    cur_payment: 0,
    cur_payFrequency: 0,
    dailyDrawFrequency: 0,
    balance: 0,
    WTP: 1,
    totalDraw: 0,
    topupRates: [0.33, 0.22, 0.11, 0.05],
    topupRanges: [[15, 30], [30, 60], [60, 90], [300, 600]],
    totalSpending: 0,
    score: 0
  }

  initData(cards, agent)
  return agent
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
  remainingTotalDailyDraw,
  WTP_reverse_sum,
  avg_wtp,
  correctionFactor,
  cards,
  WTP_offset,
  agent
) {
  if (isNaN(WTP_offset)) {
    WTP_offset = 0
  }
  /* eslint-disable */
  //wtp = willingness to pay per draw
  const WTP_ratio =  (agent.WTP_reverse+WTP_offset) / WTP_reverse_sum
  const standard_ratio = 1 / totalDailyDraw
  let deviation = (WTP_ratio - standard_ratio) / standard_ratio
  if(Number.isNaN(deviation)|| !Number.isFinite(deviation) ){
    deviation = 0
  }
  if(agent.name==='player1') {
    console.log(agent.name+': '+ WTP_reverse_sum+' '+agent.WTP_reverse+' '+ standard_ratio,+' '+agent.estimatedDailyDraw + ' / ' + totalDailyDraw)
  }
  const list = Object.keys(cards)
  const ret ={}

  const calculated_deviation = deviation
  deviation=Math.min(5,deviation)
  const WTP_diff =  (calculated_deviation-deviation)*standard_ratio*WTP_reverse_sum
  const agentEstimatedDailyDraw = agent.estimatedDailyDraw

  WTP_offset += (WTP_diff*agentEstimatedDailyDraw)/(remainingTotalDailyDraw-agentEstimatedDailyDraw)

  if(isNaN(WTP_offset)){
    WTP_offset=0;
  }
  if(agent.name==='player1') {
    console.log(agent.name + ': deviation: ' + deviation)
    console.log(agent.name + ': deviation sum: ' + deviation * agent.estimatedDailyDraw)

  }
  //assign weight for rare cards
  let sum_updated=0;
  let sum_original=0;

  //calculate card factor based on collection check on owned vs unowned
  const card_factor= collectionCheck(cards,agent,avg_wtp);
  for (const card of list) {
    if(cards[card].rarity>5) {

      ret[card] = cards[card].weight
      // if(agent.card_counter[card]===0) {
      //   ret[card] *= (1 + deviation)
      // }
      ret[card] *=(1 + deviation)*card_factor[card]
      ret[card] *= correctionFactor
      sum_updated+=ret[card];
      sum_original+=cards[card].weight;
    }
  }

  //reassign weights for the rest
  const diff = sum_updated-sum_original;
  let sum_original2 =0;
  for (const card of list) {
    if (cards[card].rarity <= 5) {
      sum_original2+=cards[card].weight;
    }
  }
  const update_ratio = (sum_original2-diff)/sum_original2
  for (const card of list) {
    if(cards[card].rarity<=5) {
      ret[card] = cards[card].weight*update_ratio
    }
  }

  return {weights:ret, WTP_offset:WTP_offset};
}

function collectionCheck(cards,agent,avg_wtp){
  const base_factor= collectionCheck_baseFactor(agent.WTP,avg_wtp);
  let card_factor={}

  //for the unowned cards, decrease rate based on deviation


  let sum=0;
  let count=0;
  for (const card of Object.keys(cards)) {
    if(cards[card].rarity>5) {
      card_factor[card]=Math.pow(base_factor,Math.min(5,agent.card_counter[card]))
      sum+=card_factor[card]
      count++;
    }
  }

  const standard_ratio = 1/count
  for(const card of Object.keys(card_factor)){
    card_factor[card]= (card_factor[card]/sum) / standard_ratio
  }
  if(agent.name==='player1'){
    console.log(base_factor)
    console.log(card_factor)
    console.log(agent.WTP)
  }
  return card_factor


}

function collectionCheck_baseFactor(wtp,avg_wtp){
  const x=wtp
  let ratio= (-(x-avg_wtp)^2/ (avg_wtp*avg_wtp/20) +20)/100
  ratio=Math.max(0,ratio);
  ratio=Math.min(1,ratio);
  return ratio+1;

}

const calculateWTP=function(agent,totalDailyDraw=1,fading_factor=0.5){

  let curWTP=0;
  if(agent.cur_payFrequency!==0){
    curWTP= agent.cur_payment/agent.cur_payFrequency*Math.pow(0.94, agent.cur_payFrequency)+agent.cur_payment/33
  }
  curWTP+=agent.baseWTP;
  const patienceFactor = totalDailyDraw/agent.dailyDrawFrequency;
  // console.log(curWTP)
  if(!isNaN(patienceFactor) && Number.isFinite(patienceFactor)  ){
    curWTP=curWTP* ((patienceFactor-1)/10 +1)
  }
  curWTP=Math.sqrt(curWTP)

  return agent.WTP*fading_factor+(1-fading_factor)*curWTP;
}



export { BuildAgent,nextDraw,getUpdatedWeight,calculateWTP,generateTopupAmount }

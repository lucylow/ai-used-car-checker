export const COPILOT_SUGGESTIONS=[
 'What should I inspect next?',
 'Why is the risk score 68?',
 'Is the asking price high?',
 'What should I ask the seller?',
 'Show me the evidence for the biggest issue',
 'Build a fair offer',
];

export const COPILOT_THREAD=[
 {id:'q1',role:'user',text:'Is this car still worth considering?'},
 {id:'a1',role:'assistant',text:'The demo data shows a moderate-risk profile. The main items to resolve are the warning indicator, bumper damage, tire wear and steering noise. I would verify those before treating the market price as final.',evidence:['af4','af1','af3','af5']},
 {id:'q2',role:'user',text:'What should I ask the seller first?'},
 {id:'a2',role:'assistant',text:'Start with the dashboard warning light because it has the highest confidence and widest repair uncertainty. Then ask for supporting service documentation.',evidence:['af4','d1']},
];

export const COPILOT_ACTIONS=[
 {id:'a1',label:'Add finding',icon:'add-circle-outline'},
 {id:'a2',label:'Open evidence',icon:'images-outline'},
 {id:'a3',label:'Compare market',icon:'stats-chart-outline'},
 {id:'a4',label:'Draft seller question',icon:'chatbubble-outline'},
];

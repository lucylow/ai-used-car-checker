export const NEGOTIATION_SCENARIOS=[
 {id:'n1',label:'Conservative',offer:18900,target:19800,max:20500,reason:'Preserve room for unknown repair cost.'},
 {id:'n2',label:'Balanced',offer:19400,target:20000,max:20750,reason:'Reflect visible findings while staying close to market center.'},
 {id:'n3',label:'Fast close',offer:20100,target:20750,max:21200,reason:'Prioritize closing speed when evidence is mostly resolved.'},
];

export const NEGOTIATION_TALKING_POINTS=[
 {id:'t1',title:'Lead with the warning indicator',detail:'Ask the seller to identify the warning code and provide a recent service receipt.',evidence:['af4']},
 {id:'t2',title:'Use bumper evidence',detail:'The front bumper finding is supported by two images and the walkaround clip.',evidence:['af1']},
 {id:'t3',title:'Bring market context',detail:'Comparable listings cluster around the low-$21k range in this demo.',evidence:['c1','c2','c3']},
 {id:'t4',title:'Ask about steering noise',detail:'The buyer voice note describes clicking during a left turn at low speed.',evidence:['af5']},
];

export const SELLER_QUESTIONS=[
 'Has the front bumper ever been repaired or repainted?',
 'What triggered the dashboard warning light?',
 'When were the front tires last replaced?',
 'Has the steering or suspension been inspected recently?',
 'Can you share the last two service invoices?',
];

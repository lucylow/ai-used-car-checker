export const REPORT_SECTIONS=[
 {id:'overview',title:'Overview',summary:'A visual summary of condition, market position and evidence completeness.',accent:'blue'},
 {id:'condition',title:'Condition',summary:'Six AI-assisted findings linked to photos, video and notes.',accent:'amber'},
 {id:'market',title:'Market',summary:'Observed comparable listings and price trend.',accent:'cyan'},
 {id:'repairs',title:'Repairs',summary:'Estimated range for visible / reported issues.',accent:'coral'},
 {id:'documents',title:'Documents',summary:'Uploaded records and confidence states.',accent:'slate'},
 {id:'negotiation',title:'Negotiation',summary:'Evidence-backed questions and talking points.',accent:'orange'},
];

export const REPORT_STATS=[
 {id:'risk',label:'Risk',value:'68',unit:'/100',helper:'Moderate risk',trend:'review'},
 {id:'market',label:'Market value',value:'$21.1k',unit:'',helper:'Observed center',trend:'stable'},
 {id:'asking',label:'Asking',value:'$21.9k',unit:'',helper:'+$800 vs center',trend:'high'},
 {id:'repairs',label:'Repairs',value:'$1.2–3.4k',unit:'',helper:'Scenario range',trend:'watch'},
 {id:'evidence',label:'Evidence',value:'14',unit:'items',helper:'Photos, video, audio, docs',trend:'good'},
];

export const REPORT_HIGHLIGHTS=[
 {id:'rh1',title:'One warning indicator needs confirmation',severity:'critical',evidence:1},
 {id:'rh2',title:'Front bumper damage has photographic evidence',severity:'major',evidence:2},
 {id:'rh3',title:'Tire wear may affect near-term cost',severity:'watch',evidence:2},
 {id:'rh4',title:'Market price is slightly above observed center',severity:'watch',evidence:3},
];

export const REPORT_ACTIVITY=[
 ['10:32','VIN scanned','done'],['10:35','Exterior photos captured','done'],['10:41','Engine video added','done'],['10:44','Buyer voice note added','done'],['10:47','AI analysis completed','done'],['10:51','Repair ranges estimated','done'],['11:02','Report reviewed','current'],['11:06','Certificate available','next'],
].map(([time,title,status])=>({time,title,status}));

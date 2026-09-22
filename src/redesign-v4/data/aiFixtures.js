export const AI_RUNS=[
 {id:'run-01',stage:'completed',startedAt:'10:47:12',durationMs:42800,model:'CarWise Vision Demo',sources:['4 photos','1 video','1 voice note','2 documents'],summary:'7 observations identified with 4 requiring attention.'},
 {id:'run-02',stage:'review',startedAt:'10:49:44',durationMs:12000,model:'CarWise Explain Demo',sources:['market data','inspection findings'],summary:'Market position is moderately above the observed fair-value center.'},
];

export const AI_PIPELINE=[
 {id:'p1',label:'Reading vehicle photos',icon:'images-outline',ms:900},
 {id:'p2',label:'Detecting visible defects',icon:'scan-outline',ms:1200},
 {id:'p3',label:'Linking evidence',icon:'link-outline',ms:850},
 {id:'p4',label:'Comparing market context',icon:'stats-chart-outline',ms:1100},
 {id:'p5',label:'Building repair impact',icon:'hammer-outline',ms:950},
 {id:'p6',label:'Generating explanation',icon:'chatbubble-ellipses-outline',ms:800},
];

export const AI_FINDINGS=[
 {id:'af1',title:'Front bumper scratch',severity:'major',confidence:.92,area:'Front bumper',cost:'$400–$750',evidence:['m-front','m-walkaround'],why:['2 exterior images','walkaround video'],action:'Verify whether damage reaches the primer before negotiating.'},
 {id:'af2',title:'Rear quarter paint variance',severity:'watch',confidence:.81,area:'Passenger rear',cost:'$250–$600',evidence:['m-rear'],why:['rear 3/4 image'],action:'Ask whether the panel has been repainted or repaired.'},
 {id:'af3',title:'Front tire wear',severity:'watch',confidence:.89,area:'Driver front',cost:'$180–$320',evidence:['m-wheel'],why:['wheel photo'],action:'Measure tread depth before purchase.'},
 {id:'af4',title:'Dashboard warning light',severity:'critical',confidence:.96,area:'Dashboard',cost:'$150–$900+',evidence:['m-dash'],why:['dashboard image'],action:'Identify the warning code and confirm repair documentation.'},
 {id:'af5',title:'Steering noise note',severity:'watch',confidence:.77,area:'Test Drive',cost:'$300–$800+',evidence:['m-voice'],why:['voice note'],action:'Have a technician reproduce the noise before signing.'},
 {id:'af6',title:'Engine vibration',severity:'watch',confidence:.72,area:'Engine',cost:'$200–$700',evidence:['m-engine-video'],why:['12-second video'],action:'Capture a longer cold-start clip or request a mechanical inspection.'},
];

export const AI_EXPLANATIONS={
 risk:{title:'Why is the risk 68?',body:'The score combines visible-condition findings, warning indicators, reported test-drive observations, and inspection completeness. It is a decision-support estimate, not a mechanical diagnosis.',evidence:['4 image findings','1 warning indicator','1 voice note','inspection 66% complete']},
 price:{title:'Why is the fair value $21,100?',body:'The demo market model weighs comparable asking prices, mileage, model year, and observed condition adjustments.',evidence:['3 comparables','$21,100 center','±$1,200 estimated range']},
 repairs:{title:'How is the repair range built?',body:'Each estimate is a scenario range aggregated from finding-level mock estimates. Actual repair costs vary by shop, parts, region, and confirmed diagnosis.',evidence:['4 finding ranges','Toronto region','parts + labor estimate']},
};

export const MARKET_SERIES=[
 {label:'May 24',value:22450}, {label:'May 31',value:22310}, {label:'Jun 07',value:22180}, {label:'Jun 14',value:21980}, {label:'Jun 21',value:21890}, {label:'Jun 28',value:21780}, {label:'Jul 05',value:21890}, {label:'Jul 12',value:22020}, {label:'Jul 19',value:21940}, {label:'Jul 26',value:21820}, {label:'Aug 02',value:21690}, {label:'Aug 09',value:21480}, {label:'Aug 16',value:21390}, {label:'Aug 23',value:21280}, {label:'Aug 30',value:21100},
];

export const MARKET_BANDS=[
 {id:'low',label:'Low',min:19800,max:20550,description:'Lower quartile'},
 {id:'fair',label:'Fair',min:20550,max:21650,description:'Observed market center'},
 {id:'high',label:'High',min:21650,max:23900,description:'Upper quartile'},
];

export const COMPARABLE_LISTINGS=[
 {id:'c1',title:'2020 Honda Accord Sport',price:21450,mileage:40100,city:'Toronto',distance:'5 km',dealer:'North York Auto',delta:-450},
 {id:'c2',title:'2020 Honda Accord Sport',price:21890,mileage:43800,city:'Scarborough',distance:'11 km',dealer:'Lakeview Motors',delta:-10},
 {id:'c3',title:'2020 Honda Accord Touring',price:22590,mileage:46800,city:'Mississauga',distance:'29 km',dealer:'Westline Honda',delta:690},
 {id:'c4',title:'2021 Honda Accord Sport',price:22900,mileage:38900,city:'Vaughan',distance:'24 km',dealer:'Maple Auto Group',delta:1000},
];

export const MARKET_FILTERS={radius:['5 km','25 km','50 km','100 km'],seller:['All','Dealer','Private'],mileage:['Any','< 30k','30–50k','> 50k'],sort:['Relevance','Price low to high','Newest','Lowest mileage']};

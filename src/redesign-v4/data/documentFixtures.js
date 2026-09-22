export const DOCUMENTS=[
 {id:'d1',name:'Service Invoice — 2025-08',type:'invoice',status:'verified',confidence:.98,pages:3,date:'Aug 14, 2025',size:'2.4 MB',source:'seller upload'},
 {id:'d2',name:'Vehicle Registration',type:'registration',status:'review',confidence:.84,pages:1,date:'Sep 01, 2026',size:'1.1 MB',source:'camera capture'},
 {id:'d3',name:'Dealer Listing PDF',type:'listing',status:'verified',confidence:.93,pages:5,date:'Sep 01, 2026',size:'3.8 MB',source:'share sheet'},
 {id:'d4',name:'Purchase Agreement',type:'contract',status:'draft',confidence:null,pages:6,date:'Sep 22, 2026',size:'620 KB',source:'CarWise'},
 {id:'d5',name:'Inspection Certificate',type:'certificate',status:'ready',confidence:.99,pages:2,date:'Sep 22, 2026',size:'410 KB',source:'CarWise'},
];

export const DOCUMENT_FIELDS=[
 {id:'f1',label:'VIN',value:'1HGCV2F34LA000000',confidence:.99,status:'verified'},
 {id:'f2',label:'Mileage',value:'42,180 mi',confidence:.97,status:'verified'},
 {id:'f3',label:'Registration expiry',value:'Jun 2027',confidence:.84,status:'review'},
 {id:'f4',label:'Seller name',value:'North Star Auto Group',confidence:.91,status:'verified'},
 {id:'f5',label:'Service date',value:'Aug 14, 2025',confidence:.98,status:'verified'},
];

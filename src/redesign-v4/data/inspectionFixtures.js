export const INSPECTION_STEPS=[
 {id:'vin',label:'VIN',icon:'barcode-outline',status:'done',duration:45,progress:.08},
 {id:'market',label:'Market',icon:'pricetags-outline',status:'done',duration:74,progress:.18},
 {id:'photos',label:'Photos',icon:'camera-outline',status:'done',duration:156,progress:.34},
 {id:'ai',label:'AI Scan',icon:'sparkles-outline',status:'done',duration:122,progress:.48},
 {id:'checklist',label:'Checklist',icon:'checkmark-done-outline',status:'current',duration:310,progress:.66},
 {id:'test-drive',label:'Test Drive',icon:'speedometer-outline',status:'next',duration:240,progress:.76},
 {id:'report',label:'Report',icon:'document-text-outline',status:'locked',duration:90,progress:.88},
 {id:'deal',label:'Deal',icon:'create-outline',status:'locked',duration:120,progress:1},
];

const item=(id,category,title,status,note,mediaCount=0,cost=null)=>({id,category,title,status,note,mediaCount,cost});

export const CHECKLIST_ITEMS=[
 item('ext-01','Exterior','Body panels','pass','Panel gaps are consistent. No major dents observed.',3),
 item('ext-02','Exterior','Paint consistency','watch','Possible repaint or blended panel at passenger rear.',2,450),
 item('ext-03','Exterior','Lights','pass','Headlights and turn signals visually functioning.',2),
 item('ext-04','Exterior','Glass','pass','No chips observed in current evidence.',1),
 item('ext-05','Exterior','Windshield seals','pass','Seals appear intact.',1),
 item('int-01','Interior','Seats & trim','pass','Normal wear for age and mileage.',2),
 item('int-02','Interior','Climate controls','pass','Controls respond normally in demo data.',1),
 item('int-03','Interior','Warning indicators','issue','Dashboard warning light captured in photo.',2,900),
 item('eng-01','Engine','Fluid leaks','watch','No active drip visible; recheck under vehicle.',2,0),
 item('eng-02','Engine','Cold start','watch','Brief vibration noted in video evidence.',1,350),
 item('eng-03','Engine','Battery/charging','pass','No obvious corrosion shown.',1),
 item('tir-01','Tires','Front tires','watch','Tread wear approaches replacement threshold.',2,250),
 item('tir-02','Tires','Rear tires','pass','Even wear in available photos.',2),
 item('brk-01','Brakes','Pedal response','pass','No issue reported in test-drive demo.',0),
 item('ele-01','Electrical','Warning lights','issue','One warning indicator visible.',2,900),
 item('ele-02','Electrical','Windows/locks','pass','All sampled controls respond.',1),
 item('drv-01','Test Drive','Steering feel','watch','Voice note reports clicking while turning left.',1,500),
 item('drv-02','Test Drive','Braking','pass','Smooth stop in demo scenario.',1),
 item('drv-03','Test Drive','Transmission','pass','No shift shock reported.',1),
 item('doc-01','Documents','Service records','pass','Invoice uploaded and parsed.',1),
 item('doc-02','Documents','Registration','watch','Document uploaded; final verification pending.',1),
 item('doc-03','Documents','Recall review','watch','One recall requires follow-up confirmation.',0),
 item('neg-01','Negotiation','Seller questions','pass','5 questions prepared from findings.',0),
 item('rep-01','Repairs','Repair estimates','current','Three ranges ready for review.',3,1700),
];

export const ISSUE_TAXONOMY=[
 {id:'paint',label:'Paint',icon:'color-palette-outline',severityOptions:['minor','watch','major']},
 {id:'body',label:'Body damage',icon:'car-outline',severityOptions:['minor','watch','major']},
 {id:'tire',label:'Tire wear',icon:'ellipse-outline',severityOptions:['watch','major']},
 {id:'warning',label:'Warning light',icon:'warning-outline',severityOptions:['watch','critical']},
 {id:'mechanical',label:'Mechanical',icon:'construct-outline',severityOptions:['watch','major','critical']},
 {id:'document',label:'Document',icon:'document-text-outline',severityOptions:['watch','major']},
];

export const EVIDENCE_TAGS=[
 'front bumper','rear quarter','driver tire','dashboard','engine bay','steering','service record','registration','seller note','test drive'
];

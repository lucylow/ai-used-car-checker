export const MULTIMODAL_SESSIONS=[
 {id:'ms1',title:'Exterior walkaround',status:'ready',inputs:[
  {kind:'photo',id:'m-front',label:'Front 3/4',quality:'good'},
  {kind:'photo',id:'m-rear',label:'Rear 3/4',quality:'good'},
  {kind:'video',id:'m-walkaround',label:'28s walkaround',quality:'good'},
  {kind:'voice',id:'m-voice',label:'Buyer observation',quality:'good'},
 ],output:'4 linked observations'},
 {id:'ms2',title:'Engine evidence',status:'needs-review',inputs:[
  {kind:'photo',id:'m-engine',label:'Engine bay',quality:'fair'},
  {kind:'video',id:'m-engine-video',label:'12s cold start',quality:'good'},
 ],output:'1 possible issue'},
 {id:'ms3',title:'Document verification',status:'ready',inputs:[
  {kind:'document',id:'m-history',label:'Service invoice',quality:'high'},
  {kind:'document',id:'m-registration',label:'Registration',quality:'medium'},
 ],output:'5 extracted fields'},
];

export const CAPTURE_TASKS=[
 {id:'ct1',area:'Front 3/4',required:true,media:'photo',tip:'Include bumper, hood and headlights.'},
 {id:'ct2',area:'Rear 3/4',required:true,media:'photo',tip:'Include quarter panel and tail lamp.'},
 {id:'ct3',area:'Driver side',required:true,media:'photo',tip:'Keep the whole side in frame.'},
 {id:'ct4',area:'Dashboard',required:true,media:'photo',tip:'Capture all visible warning indicators.'},
 {id:'ct5',area:'Engine bay',required:true,media:'photo',tip:'Use daylight where possible.'},
 {id:'ct6',area:'Cold start',required:false,media:'video',tip:'Record 10–20 seconds from startup.'},
 {id:'ct7',area:'Test drive note',required:false,media:'voice',tip:'Describe unusual sounds or behavior.'},
 {id:'ct8',area:'Service documents',required:false,media:'document',tip:'Capture invoices and maintenance records.'},
];

export const MEDIA_REVIEW_STATES=[
 {id:'review-good',label:'Good evidence',description:'Sharp, centered, well lit.',tone:'success'},
 {id:'review-glare',label:'Glare detected',description:'Try tilting the camera slightly.',tone:'warning'},
 {id:'review-dark',label:'Too dark',description:'Move to a brighter area.',tone:'warning'},
 {id:'review-blur',label:'Motion blur',description:'Hold still for one second.',tone:'danger'},
 {id:'review-partial',label:'Vehicle partially visible',description:'Step back and recenter.',tone:'warning'},
];

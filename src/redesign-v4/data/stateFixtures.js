export const SCREEN_STATES=['default','loading','empty','error','success','offline','permission','locked'];

export const MOCK_NETWORK_STATES=[
 {id:'online',label:'Online',latency:180,retryable:false},
 {id:'slow',label:'Slow connection',latency:2200,retryable:true},
 {id:'offline',label:'Offline',latency:null,retryable:true},
 {id:'timeout',label:'Request timed out',latency:10000,retryable:true},
 {id:'server-error',label:'Temporary server error',latency:0,retryable:true},
];

export const LOADING_MESSAGES={
 vin:['Opening camera','Locating VIN','Reading characters','Verifying vehicle'],
 market:['Fetching comparable listings','Normalizing mileage','Estimating market center','Preparing price range'],
 ai:['Reviewing photos','Linking evidence','Comparing condition','Estimating impact','Preparing findings'],
 report:['Organizing findings','Building evidence sections','Preparing shareable report'],
 certificate:['Verifying inspection','Hashing evidence record','Preparing certificate'],
};

export const ERROR_COPY={
 camera:{title:'Camera unavailable',body:'CarWise could not access the camera. You can upload an existing photo instead.',primary:'Choose Photo',secondary:'Try Again'},
 market:{title:'Market data temporarily unavailable',body:'Your vehicle information is saved. Retry when the connection improves.',primary:'Retry',secondary:'Continue Offline'},
 ai:{title:'Analysis paused',body:'Your evidence is safe. Resume the analysis when the service is reachable.',primary:'Resume',secondary:'Review Evidence'},
 document:{title:'Document could not be read',body:'Try a clearer photo or upload the original PDF.',primary:'Upload Again',secondary:'Save Anyway'},
 signature:{title:'Signature session expired',body:'The draft remains saved. Create a fresh signature session when ready.',primary:'Restart Signature',secondary:'Review Contract'},
};

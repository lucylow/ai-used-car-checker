/**
 * CarWise V4 multimedia fixtures.
 * Mock-only. Replace with camera/library URIs in production.
 */
export const MEDIA_KINDS = Object.freeze({ PHOTO:'photo', VIDEO:'video', AUDIO:'audio', DOCUMENT:'document' });

const u=(id)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=84`;

export const VEHICLE_MEDIA=[
  {id:'m-front',kind:'photo',title:'Front 3/4',area:'Front bumper',uri:u('photo-1606664515524-ed2f786a0bd6'),duration:null,aspect:1.55,tag:'hero'},
  {id:'m-rear',kind:'photo',title:'Rear 3/4',area:'Rear quarter',uri:u('photo-1552519507-da3b142c6e3d'),duration:null,aspect:1.55,tag:'exterior'},
  {id:'m-side',kind:'photo',title:'Driver side',area:'Driver side',uri:u('photo-1492144534655-ae79c964c9d7'),duration:null,aspect:1.55,tag:'exterior'},
  {id:'m-dash',kind:'photo',title:'Dashboard',area:'Electrical',uri:u('photo-1504215680853-026ed2a45def'),duration:null,aspect:1.55,tag:'interior'},
  {id:'m-seat',kind:'photo',title:'Driver seat',area:'Interior',uri:u('photo-1551830820-330a71b99659'),duration:null,aspect:1.55,tag:'interior'},
  {id:'m-wheel',kind:'photo',title:'Front wheel',area:'Driver front',uri:u('photo-1605559424843-9e4c1f8b0f7b'),duration:null,aspect:1.55,tag:'tires'},
  {id:'m-engine',kind:'photo',title:'Engine bay',area:'Engine',uri:u('photo-1486006920555-c77dcf18193c'),duration:null,aspect:1.55,tag:'engine'},
  {id:'m-trunk',kind:'photo',title:'Trunk',area:'Rear',uri:u('photo-1542362567-b07e54358753'),duration:null,aspect:1.55,tag:'exterior'},
  {id:'m-engine-video',kind:'video',title:'Cold start',area:'Engine',uri:'mock://video/cold-start-01',duration:12,aspect:1.78,tag:'diagnostic',transcript:'Engine starts on the first attempt. Brief vibration noted near second 7.'},
  {id:'m-walkaround',kind:'video',title:'Walkaround',area:'Exterior',uri:'mock://video/walkaround-01',duration:28,aspect:1.78,tag:'inspection',transcript:'Front bumper scratch, paint variance at passenger rear, tire wear visible.'},
  {id:'m-voice',kind:'audio',title:'Buyer voice note',area:'Test Drive',uri:'mock://audio/voice-01',duration:17,aspect:null,tag:'note',transcript:'Clicking noise when steering left at low speed.'},
  {id:'m-history',kind:'document',title:'Service invoice',area:'Documents',uri:'mock://document/invoice-01',duration:null,aspect:0.77,tag:'verified',pages:3},
  {id:'m-registration',kind:'document',title:'Registration',area:'Documents',uri:'mock://document/registration-01',duration:null,aspect:0.77,tag:'pending',pages:1},
  {id:'m-contract',kind:'document',title:'Purchase agreement',area:'Contract',uri:'mock://document/contract-01',duration:null,aspect:0.77,tag:'signature',pages:6},
];

export const MEDIA_STATS={
  photos:VEHICLE_MEDIA.filter(x=>x.kind==='photo').length,
  videos:VEHICLE_MEDIA.filter(x=>x.kind==='video').length,
  audio:VEHICLE_MEDIA.filter(x=>x.kind==='audio').length,
  documents:VEHICLE_MEDIA.filter(x=>x.kind==='document').length,
  total:VEHICLE_MEDIA.length,
};

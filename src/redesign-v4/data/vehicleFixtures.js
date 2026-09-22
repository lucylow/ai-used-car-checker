/** Rich vehicle cards for carousel, history, comparison and demos. */
const photo=(id)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const VEHICLES=[
 {id:'v1',year:2020,make:'Honda',model:'Accord',trim:'Sport 2.0T',mileage:42180,asking:21900,market:21100,risk:68,scoreLabel:'Moderate risk',location:'Toronto, ON',color:'Platinum White',image:photo('photo-1606664515524-ed2f786a0bd6'),badges:['VIN verified','7 findings'],status:'active'},
 {id:'v2',year:2021,make:'Toyota',model:'Camry',trim:'SE',mileage:33720,asking:23990,market:23500,risk:34,scoreLabel:'Low risk',location:'Markham, ON',color:'Midnight Black',image:photo('photo-1621007947382-bb3c3994e3fb'),badges:['4.8★ seller','Clean'],status:'complete'},
 {id:'v3',year:2019,make:'BMW',model:'3 Series',trim:'330i xDrive',mileage:56910,asking:25900,market:24850,risk:74,scoreLabel:'High risk',location:'Mississauga, ON',color:'Alpine White',image:photo('photo-1555215695-3004980ad54e'),badges:['6 findings','2 critical'],status:'warning'},
 {id:'v4',year:2022,make:'Ford',model:'Mustang',trim:'EcoBoost Premium',mileage:28140,asking:28900,market:29200,risk:22,scoreLabel:'Low risk',location:'Vaughan, ON',color:'Rapid Red',image:photo('photo-1584345604476-8ec5e12e42dd'),badges:['1 watch','Good value'],status:'complete'},
 {id:'v5',year:2020,make:'Tesla',model:'Model 3',trim:'Long Range AWD',mileage:48320,asking:26950,market:26300,risk:51,scoreLabel:'Watch',location:'Oakville, ON',color:'Pearl White',image:photo('photo-1536700503339-1e4b06520771'),badges:['Battery check','8 photos'],status:'active'},
 {id:'v6',year:2023,make:'Hyundai',model:'Tucson',trim:'Preferred AWD',mileage:19120,asking:30900,market:30550,risk:18,scoreLabel:'Low risk',location:'Richmond Hill, ON',color:'Amazon Gray',image:photo('photo-1606664515524-ed2f786a0bd6'),badges:['1 owner','Factory warranty'],status:'complete'},
];

export const ACTIVE_VEHICLE=VEHICLES[0];

export const VEHICLE_SPEC_ROWS=[
 ['Engine','2.0L Turbo','Automatic transmission','FWD'],
 ['Power','252 hp','Torque','273 lb-ft'],
 ['Fuel','Gasoline','EPA combined','30 MPG'],
 ['Ownership','2 owners','Service records','18 entries'],
 ['Last service','32 days ago','Open recalls','1 review'],
];

export const VEHICLE_ZONES=[
 {id:'front',label:'Front',risk:'major',score:62,findings:2,media:2},
 {id:'rear',label:'Rear',risk:'watch',score:79,findings:1,media:1},
 {id:'driver',label:'Driver side',risk:'pass',score:91,findings:0,media:2},
 {id:'passenger',label:'Passenger side',risk:'watch',score:82,findings:1,media:1},
 {id:'roof',label:'Roof',risk:'pass',score:96,findings:0,media:1},
 {id:'interior',label:'Interior',risk:'pass',score:88,findings:1,media:2},
 {id:'engine',label:'Engine',risk:'watch',score:73,findings:1,media:2},
 {id:'wheels',label:'Wheels & tires',risk:'watch',score:76,findings:1,media:2},
];

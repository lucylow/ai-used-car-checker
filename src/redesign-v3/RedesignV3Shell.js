import React,{useMemo,useState} from 'react';
import {StatusBar,View} from 'react-native';
import {COLORS} from './tokens';
import BottomDock from './components/BottomDock';
import AIChatFab from './components/AIChatFab';
import {resolveScreen} from './screenRegistry';
import {DEMO_VEHICLE} from './data/demoData';

const routeAlias={home:'home',inspect:'inspect',report:'report',history:'history',profile:'profile',vin:'vin',market:'market',camera:'camera',evidence:'evidence',ai:'ai',checklist:'checklist',test:'test',costs:'costs',negotiation:'negotiation',documents:'documents',certificate:'certificate',contract:'contract',signature:'signature',compare:'compare',paywall:'paywall',copilot:'copilot',notifications:'notifications',share:'share',maintenance:'maintenance',marketplace:'marketplace',detail:'vehicleDetailV3',demo:'demoGarageV3',demoCompare:'demoCompareV3',demoAnalytics:'demoAnalyticsV3'};

export default function RedesignV3Shell({initialRoute='home',vehicle=DEMO_VEHICLE,onExit}){
 const [route,setRoute]=useState(initialRoute);
 const [activeVehicle,setActiveVehicle]=useState(vehicle);
 const ScreenComponent=useMemo(()=>resolveScreen(route),[route]);
 const nav=(next)=>setRoute(routeAlias[next]||next);
 const selectDemoVehicle=(nextVehicle)=>{setActiveVehicle(nextVehicle);setRoute('vehicleDetailV3');};
 return <View style={{flex:1,backgroundColor:COLORS.ink}}>
   <StatusBar barStyle="light-content" backgroundColor={COLORS.ink}/>
   <ScreenComponent vehicle={activeVehicle} onBack={()=>route===initialRoute?onExit?.():setRoute('home')} onNavigate={nav} onSelectVehicle={selectDemoVehicle}/>
   <AIChatFab onPress={()=>nav('copilot')}/>
   <BottomDock active={['home','inspect','report','history','profile'].includes(route)?route:'home'} onNavigate={nav}/>
 </View>;
}
export {routeAlias};

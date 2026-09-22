import React,{useState} from 'react';
import {View} from 'react-native';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface';
import Button from '../components/Button';
import Text from '../components/Text';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,CHECKLIST,COMPARABLES,REPAIRS,TIMELINE,MARKET_POINTS} from '../data/demoData';
import VehicleHero from '../components/VehicleHero';
import RiskRing from '../components/RiskRing';
import AIInsight from '../components/AIInsight';
import AITrustBanner from '../components/AITrustBanner';
import PriceRange from '../components/PriceRange';
import ChecklistRow from '../components/ChecklistRow';
import MediaTile from '../components/MediaTile';
import MultimodalTray from '../components/MultimodalTray';
import DocumentEvidence from '../components/DocumentEvidence';
import ConfidenceBar from '../components/ConfidenceBar';
import InfoRow from '../components/InfoRow';
import VehicleMap from '../components/VehicleMap';
import InspectionTimeline from '../components/InspectionTimeline';
import CostBreakdown from '../components/CostBreakdown';
import RepairLine from '../components/RepairLine';
import NegotiationPoint from '../components/NegotiationPoint';
import CopilotInput from '../components/CopilotInput';
import CopilotMessage from '../components/CopilotMessage';
import EmptyState from '../components/EmptyState';
import {ScrollView} from 'react-native';

export default function HistoryV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Inspection history" eyebrow="GARAGE" subtitle="Browse every vehicle, evidence set and final report." onBack={onBack}/>

    <Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="caption" muted>Vehicles inspected</Text><Text variant="display" style={{marginTop:2}}>12</Text></View><Badge label="4 active" tone="info"/></View></Surface>
    <SectionHeader title="Recent"/>
    {[DEMO_VEHICLE,{...DEMO_VEHICLE,id:'2',year:2021,make:'Toyota',model:'RAV4 XLE',risk:42,askingPrice:28900,marketValue:28100},{...DEMO_VEHICLE,id:'3',year:2019,make:'BMW',model:'330i',risk:78,askingPrice:25900,marketValue:24400}].map((v,i)=><View key={v.id} style={{marginBottom:10}}><View onTouchEnd={()=>onNavigate?.('detail')}><VehicleHero vehicle={v}/></View></View>)}
    <SectionHeader title="Filter"/><View style={{flexDirection:'row',gap:8}}>{['All','Low risk','Watch','Critical'].map(x=><Badge key={x} label={x} tone={x==='Critical'?'danger':x==='Watch'?'watch':x==='Low risk'?'success':'info'}/>)}</View>

  </Screen>;
}

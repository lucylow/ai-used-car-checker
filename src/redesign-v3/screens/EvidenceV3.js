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

export default function EvidenceV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Evidence review" eyebrow="EVIDENCE" subtitle="Inspect, annotate and organize every piece of media." onBack={onBack}/>

    <AITrustBanner/>
    <SectionHeader title="Photo evidence"/><View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{DEMO_VEHICLE.photos.map((uri,i)=><MediaTile key={uri} item={{uri,type:'photo',label:['Front bumper','Passenger rear','Side profile','Dashboard'][i],meta:i===0?'Scratch':'Clean'}} onPress={()=>{}}/>)}</View>
    <SectionHeader title="AI findings"/><AIInsight finding={FINDINGS[0]}/><AIInsight finding={FINDINGS[3]}/>
    <SectionHeader title="Video evidence"/><Surface><Text variant="h3">Engine running</Text><Text variant="caption" muted style={{marginTop:4}}>00:10 · captured today</Text><View style={{height:8,backgroundColor:COLORS.surface2,borderRadius:99,marginTop:14}}><View style={{width:'62%',height:8,borderRadius:99,backgroundColor:COLORS.cyan}}/></View><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}><Badge label="00:03 · vibration" tone="watch"/><Badge label="00:09 · smoke" tone="danger"/></View></Surface>
    <SectionHeader title="Add more evidence"/><MultimodalTray onPick={()=>{}}/>

  </Screen>;
}

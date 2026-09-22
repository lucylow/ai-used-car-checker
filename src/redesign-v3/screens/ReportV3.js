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

export default function ReportV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Inspection report" eyebrow="REPORT" subtitle="A visual summary of condition, evidence, price and next actions." onBack={onBack}/>

    <VehicleHero vehicle={DEMO_VEHICLE}/>
    <SectionHeader title="Decision snapshot"/><View style={{flexDirection:'row',gap:9,flexWrap:'wrap'}}><StatCard label="Risk" value="68" sub="Moderate" icon="pulse" tone={COLORS.amber}/><StatCard label="Repairs" value="$980+" sub="estimated" icon="construct" tone={COLORS.amber}/><StatCard label="Market" value="$21.1K" sub="estimate" icon="analytics" tone={COLORS.mint}/></View>
    <SectionHeader title="Evidence gallery"/><View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{DEMO_VEHICLE.photos.map((uri,i)=><MediaTile key={uri} item={{uri,type:'photo',label:['Front','Rear','Side','Dashboard'][i],meta:'2 annotations'}} onPress={()=>onNavigate?.('evidence')}/>)}</View>
    <SectionHeader title="Findings"/>{FINDINGS.map(f=><AIInsight key={f.id} finding={f}/>)}
    <SectionHeader title="Inspection timeline"/><InspectionTimeline items={TIMELINE}/>
    <SectionHeader title="Report actions"/><View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><Button title="Certificate" onPress={()=>onNavigate?.('certificate')} /></View><View style={{flex:1}}><Button title="Contract" variant="outline" onPress={()=>onNavigate?.('contract')} /></View></View>

  </Screen>;
}

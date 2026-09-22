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

export default function MaintenanceV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Maintenance" eyebrow="OWNERSHIP" subtitle="Turn inspection findings into a lightweight ownership checklist." onBack={onBack}/>

    <Surface><Badge label="UPCOMING" tone="watch"/><Text variant="h2" style={{marginTop:9}}>Front tires</Text><Text muted style={{marginTop:4}}>Observed wear may justify a closer check soon.</Text><Text variant="display" color={COLORS.amber} style={{marginTop:11}}>$180–$320</Text></Surface>
    <SectionHeader title="Maintenance timeline"/>{[['Now','Review warning light','critical'],['30 days','Check tire wear','watch'],['90 days','Rotate / inspect brakes','info'],['6 months','Routine service review','success']].map(([d,t,ton])=><View key={t} style={{flexDirection:'row',paddingVertical:10,gap:10}}><Badge label={d} tone={ton==='critical'?'danger':ton==='watch'?'watch':ton==='success'?'success':'info'}/><Text variant="bodyStrong" style={{flex:1}}>{t}</Text></View>)}
    <SectionHeader title="Add reminder"/><Button title="Create maintenance reminder" onPress={()=>{}}/>

  </Screen>;
}

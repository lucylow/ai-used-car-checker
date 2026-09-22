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

export default function ReportComposerV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Report composer" eyebrow="EXPORT" subtitle="Build a clean report from reusable sections and linked evidence." onBack={onBack}/>

    <Surface><Badge label="READY TO EXPORT" tone="success"/><Text variant="h2" style={{marginTop:10}}>Report contents</Text><Text muted style={{marginTop:4}}>Drag/reorder in the production implementation while keeping each section linked to its source evidence.</Text></Surface>
    {['Cover','Decision snapshot','Market intelligence','Condition findings','Evidence gallery','Repair costs','Negotiation brief','Documents','Certificate'].map((x,i)=><View key={x} style={{padding:13,borderRadius:RADIUS.md,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,marginBottom:8,flexDirection:'row',alignItems:'center',gap:10}}><Badge label={String(i+1).padStart(2,'0')} tone="info"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text><Text variant="caption" color={COLORS.muted}>Drag</Text></View>)}
    <View style={{marginTop:8}}><Button title="Export PDF" icon="download" onPress={()=>{}}/></View>

  </Screen>;
}

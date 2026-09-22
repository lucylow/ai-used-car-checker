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

export default function AppearanceV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Appearance" eyebrow="PREFERENCES" subtitle="Keep the visual language consistent across dark and light themes." onBack={onBack}/>

    <Surface><Badge label="DARK MODE" tone="info"/><Text variant="display" style={{marginTop:12}}>Premium by default.</Text><Text muted style={{marginTop:5}}>Use deep navy surfaces, luminous cyan accents and restrained status colors.</Text></Surface>
    <SectionHeader title="Theme options"/>{['Dark','Light','System'].map(x=><View key={x} onTouchEnd={()=>{}} style={{padding:13,borderRadius:RADIUS.md,borderWidth:1,borderColor:x==='Dark'?COLORS.cyan:COLORS.line,backgroundColor:COLORS.surface,marginBottom:8}}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text variant="bodyStrong">{x}</Text><Badge label={x==='Dark'?'Active':'Use'} tone={x==='Dark'?'info':'neutral'}/></View></View>)}
    <SectionHeader title="Motion"/><Text variant="caption" muted>All decorative motion should respect the system reduced-motion preference.</Text>

  </Screen>;
}

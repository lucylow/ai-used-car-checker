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

export default function SafetyV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Safety notes" eyebrow="SAFETY" subtitle="Never turn an AI estimate into a false mechanical diagnosis." onBack={onBack}/>

    <Surface style={{backgroundColor:'rgba(241,107,107,.07)',borderColor:'rgba(241,107,107,.22)'}}><Badge label="IMPORTANT" tone="danger"/><Text variant="h2" style={{marginTop:10}}>AI findings need context</Text><Text muted style={{marginTop:5}}>Visual analysis can surface possible issues; it does not replace an in-person inspection by a qualified professional.</Text></Surface>
    <SectionHeader title="Use CarWise to"/>{['Collect consistent evidence','Organize questions for the seller','Understand market context','Record what was observed'].map(x=><View key={x} style={{paddingVertical:9,flexDirection:'row',gap:8}}><Badge label="✓" tone="success"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}
    <SectionHeader title="Escalate when"/>{['Safety-critical warning lights','Brake or steering concerns','Structural damage concerns','Unclear title or ownership documents'].map(x=><View key={x} style={{paddingVertical:9,flexDirection:'row',gap:8}}><Badge label="!" tone="danger"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}

  </Screen>;
}

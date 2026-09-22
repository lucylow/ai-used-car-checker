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

export default function AIV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="AI analysis" eyebrow="CARWISE AI" subtitle="Turn evidence into reviewable findings, not black-box answers." onBack={onBack}/>

    <Surface><View style={{flexDirection:'row',alignItems:'center',gap:18}}><RiskRing score={68}/><View style={{flex:1}}><Badge label="MODERATE RISK" tone="watch"/><Text variant="h2" style={{marginTop:8}}>4 findings</Text><Text muted style={{marginTop:4}}>2 watch · 1 major · 1 critical</Text></View></View></Surface>
    <SectionHeader title="Findings"/><View>{FINDINGS.map(f=><AIInsight key={f.id} finding={f}/>)}</View>
    <SectionHeader title="Explainability"/><Surface><Text variant="h3">Evidence connected</Text><Text muted style={{marginTop:5}}>Every finding should trace back to an image, note, document, or market signal.</Text><View style={{marginTop:12}}><ConfidenceBar value={.91}/></View><View style={{marginTop:10}}><Button title="Review evidence" variant="outline" onPress={()=>onNavigate?.('evidence')}/></View></Surface>
    <SectionHeader title="Next best action"/><Surface><Badge label="RECOMMENDED" tone="info"/><Text variant="h3" style={{marginTop:9}}>Verify the dashboard warning</Text><Text muted style={{marginTop:4}}>Capture a clearer photo or ask a qualified mechanic for confirmation.</Text><View style={{marginTop:12}}><Button title="Open checklist" onPress={()=>onNavigate?.('checklist')}/></View></Surface>

  </Screen>;
}

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

export default function SignatureV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Review & sign" eyebrow="HUMAN AUTHORIZATION" subtitle="AI can prepare. Only you authorize and sign." onBack={onBack}/>

    <Surface><Badge label="HUMAN SIGNATURE" tone="info"/><Text variant="h2" style={{marginTop:10}}>Your authorization matters</Text><Text muted style={{marginTop:5}}>Review the contract, confirm the amount and sign only when the terms are correct.</Text></Surface>
    <SectionHeader title="Final checks"/>{['Vehicle identity matches','Purchase price is correct','Known findings reviewed','Deposit and validity confirmed'].map(x=><View key={x} style={{paddingVertical:10,flexDirection:'row',gap:10,borderBottomWidth:1,borderBottomColor:COLORS.line}}><Badge label="✓" tone="success"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}
    <SectionHeader title="Document preview"/><Surface><Text variant="mono">PURCHASE AGREEMENT</Text><Text variant="caption" muted style={{marginTop:9}}>Generated from the current inspection record. Scrollable production document viewer should support search, zoom and page thumbnails.</Text><View style={{marginTop:12}}><Button title="Open full document" variant="outline" onPress={()=>onNavigate?.('contract')}/></View></Surface>
    <View style={{marginTop:14}}><Button title="Sign Now" icon="create" onPress={()=>{}}/></View>

  </Screen>;
}

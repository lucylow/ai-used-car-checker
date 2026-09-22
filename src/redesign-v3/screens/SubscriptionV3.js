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

export default function SubscriptionV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Subscription" eyebrow="BILLING" subtitle="Make upgrade, restore and cancellation paths App Store-friendly." onBack={onBack}/>

    <Surface><Badge label="PRO" tone="info"/><Text variant="h1" style={{marginTop:10}}>Your plan</Text><Text variant="display" style={{fontSize:30,marginTop:6}}>$9.99 / month</Text><Text muted style={{marginTop:4}}>Renews through the App Store when enabled in production.</Text></Surface>
    <SectionHeader title="Entitlements"/>{['Unlimited inspections','Advanced evidence','Premium report exports','Negotiation coach'].map(x=><View key={x} style={{flexDirection:'row',gap:8,paddingVertical:8}}><Badge label="✓" tone="success"/><Text variant="bodyStrong">{x}</Text></View>)}
    <SectionHeader title="Store controls"/><Button title="Restore purchases" variant="outline" onPress={()=>{}}/><View style={{height:8}}/><Button title="Manage subscription" onPress={()=>{}}/>

  </Screen>;
}

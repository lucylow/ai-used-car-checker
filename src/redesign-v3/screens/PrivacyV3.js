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

export default function PrivacyV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Privacy & data" eyebrow="TRUST" subtitle="Make data actions explicit and easy to understand." onBack={onBack}/>

    <Surface><Badge label="LOCAL + CLOUD" tone="info"/><Text variant="h2" style={{marginTop:10}}>Your inspection belongs to you.</Text><Text muted style={{marginTop:5}}>Explain what is stored, why it is needed and how to export or delete it.</Text></Surface>
    <SectionHeader title="Data categories"/>{[['Inspection evidence','Photos, notes, findings'],['Documents','Uploaded files and extraction metadata'],['Account','Profile and subscription status'],['Sharing','Links and shared reports']].map(([a,b])=><View key={a} style={{paddingVertical:11,borderBottomWidth:1,borderBottomColor:COLORS.line}}><Text variant="bodyStrong">{a}</Text><Text variant="caption" muted style={{marginTop:3}}>{b}</Text></View>)}
    <SectionHeader title="Actions"/><Button title="Export data" variant="outline" onPress={()=>{}}/><View style={{height:8}}/><Button title="Delete account" variant="ghost" onPress={()=>{}}/>

  </Screen>;
}

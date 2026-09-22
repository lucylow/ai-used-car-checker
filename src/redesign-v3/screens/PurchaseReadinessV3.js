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

export default function PurchaseReadinessV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Purchase readiness" eyebrow="DECISION" subtitle="A final visual checklist before a buyer commits." onBack={onBack}/>

    <Surface><View style={{alignItems:'center'}}><RiskRing score={68}/><Text variant="h2" style={{marginTop:14}}>Review before purchase</Text><Text muted style={{textAlign:'center',marginTop:5}}>CarWise highlights open questions; the buyer remains responsible for the final decision.</Text></View></Surface>
    <SectionHeader title="Open items"/>{['Dashboard warning light','Front bumper repair scope','Seller service records'].map(x=><View key={x} style={{paddingVertical:11,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',gap:9}}><Badge label="OPEN" tone="watch"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}
    <SectionHeader title="Ready items"/>{['VIN verified','Market comparison captured','Inspection report generated','Human signature step prepared'].map(x=><View key={x} style={{paddingVertical:10,flexDirection:'row',gap:9}}><Badge label="✓" tone="success"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}

  </Screen>;
}

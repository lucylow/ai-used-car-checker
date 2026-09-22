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

export default function IssueSheetV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Add issue" eyebrow="INSPECTION" subtitle="Capture severity, description, media and cost without losing context." onBack={onBack}/>

    <Surface><Text variant="h2">Front bumper</Text><Text muted style={{marginTop:4}}>Add a structured issue so it stays connected to the vehicle map and report.</Text></Surface>
    <SectionHeader title="Severity"/><View style={{flexDirection:'row',gap:8}}>{[['Critical','danger'],['Major','watch'],['Minor','success']].map(([x,t])=><View key={x} style={{flex:1}}><Button title={x} variant={t==='danger'?'danger':'outline'} onPress={()=>{}}/></View>)}</View>
    <SectionHeader title="Evidence"/><MultimodalTray onPick={()=>{}}/>
    <SectionHeader title="Estimated cost"/><Surface><InfoRow label="Low" value="$400"/><InfoRow label="High" value="$750"/><Text variant="caption" muted style={{marginTop:7}}>Use a range and show that it is an estimate.</Text></Surface>
    <View style={{marginTop:14}}><Button title="Save issue" onPress={()=>onNavigate?.('checklist')}/></View>

  </Screen>;
}

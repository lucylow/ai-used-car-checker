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

export default function SearchV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Search" eyebrow="FIND VEHICLE" subtitle="Search your garage, evidence, VINs and reports from one place." onBack={onBack}/>

    <Surface><Text variant="h2">Search your vehicle workspace</Text><Text muted style={{marginTop:4}}>Results should prioritize the current inspection.</Text><View style={{marginTop:14,height:50,borderRadius:RADIUS.md,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface2,justifyContent:'center',paddingHorizontal:13}}><Text variant="caption" muted>⌕  VIN, vehicle, issue, document…</Text></View></Surface>
    <SectionHeader title="Suggested"/>{['Front bumper scratch','1HGCV2F34LA000000','Service invoice','Negotiation brief'].map(x=><View key={x} style={{paddingVertical:11,borderBottomWidth:1,borderBottomColor:COLORS.line}}><Text variant="bodyStrong">{x}</Text><Text variant="caption" muted style={{marginTop:3}}>Search result</Text></View>)}

  </Screen>;
}

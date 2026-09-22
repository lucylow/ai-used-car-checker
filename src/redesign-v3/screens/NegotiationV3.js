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

export default function NegotiationV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Negotiation coach" eyebrow="NEGOTIATION" subtitle="Prepare evidence-backed talking points and an offer range." onBack={onBack}/>

    <Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="caption" muted>Suggested target</Text><Text variant="display" style={{marginTop:2}}>$19,400</Text><Badge label="Illustrative range" tone="info"/></View><View style={{alignItems:'flex-end'}}><Text variant="caption" muted>Maximum</Text><Text variant="h2" color={COLORS.amber} style={{marginTop:4}}>$20,000</Text></View></View></Surface>
    <SectionHeader title="Your evidence"/>
    <NegotiationPoint text="Front bumper damage is estimated at $400–$750." evidence="2 photos + AI finding"/>
    <NegotiationPoint text="Front tire wear may require replacement soon." evidence="inspection checklist"/>
    <NegotiationPoint text="Asking price is above the current market estimate." evidence="3 comparable listings"/>
    <SectionHeader title="Suggested script"/><Surface><Text>“I like the car, but the inspection surfaced a few items I'll need to budget for. Based on the comparable listings and the repair estimates, I'd be comfortable at $19,400.”</Text><View style={{marginTop:12}}><Button title="Copy script" variant="outline" onPress={()=>{}}/></View></Surface>
    <SectionHeader title="Next"/><Button title="Prepare contract" icon="document-text" onPress={()=>onNavigate?.('contract')} />

  </Screen>;
}

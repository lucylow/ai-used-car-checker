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

export default function CopilotV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Ask CarWise" eyebrow="AI COPILOT" subtitle="A visual, evidence-linked assistant for the inspection journey." onBack={onBack}/>

    <Surface><Badge label="CONTEXT: 2020 ACCORD" tone="info"/><Text variant="h2" style={{marginTop:10}}>What do you want to know?</Text><Text muted style={{marginTop:4}}>Ask about findings, price, next steps, documents or seller questions.</Text></Surface>
    <CopilotMessage text="I found 4 issues linked to your inspection evidence. The largest uncertainty is the dashboard warning light." evidence={['Dashboard photo','AI finding','Inspection checklist']}/>
    <CopilotMessage role="user" text="What should I ask the seller?"/>
    <CopilotMessage text="Ask whether the warning light has been diagnosed, whether there are service records, and whether the vehicle can be inspected by your mechanic before purchase." evidence={['Seller questions','Service records']}/>
    <SectionHeader title="Suggested prompts"/><View style={{gap:8}}>{['Is this asking price reasonable?','What should I inspect next?','Explain the biggest risk.','Turn findings into a negotiation script.'].map(q=><Surface key={q} padded={false} style={{padding:12}}><Text variant="bodyStrong">{q}</Text></Surface>)}</View>
    <SectionHeader title="Ask a follow-up"/><CopilotInput onSend={()=>{}}/>

  </Screen>;
}

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

export default function OnboardingV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="How CarWise works" eyebrow="GET STARTED" subtitle="Introduce the evidence-first journey without overwhelming the first screen." onBack={onBack}/>

    <Surface><Badge label="01 · CAPTURE" tone="info"/><Text variant="display" style={{marginTop:12}}>See the car clearly.</Text><Text muted style={{marginTop:6}}>Use VIN, photos, video, voice notes and documents to build context.</Text><View style={{height:120,marginTop:16,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text variant="h2" color={COLORS.cyan}>PHOTO + VIDEO + VOICE</Text></View></Surface>
    <Surface style={{marginTop:10}}><Badge label="02 · UNDERSTAND" tone="watch"/><Text variant="h2" style={{marginTop:10}}>Link findings to evidence.</Text><Text muted style={{marginTop:5}}>AI helps summarize possible issues while clearly showing confidence and source evidence.</Text></Surface>
    <Surface style={{marginTop:10}}><Badge label="03 · DECIDE" tone="success"/><Text variant="h2" style={{marginTop:10}}>Know the price and next step.</Text><Text muted style={{marginTop:5}}>Market context, estimated repairs and negotiation talking points come together in one report.</Text></Surface>
    <View style={{marginTop:16}}><Button title="Start an inspection" onPress={()=>onNavigate?.('inspect')}/></View>

  </Screen>;
}

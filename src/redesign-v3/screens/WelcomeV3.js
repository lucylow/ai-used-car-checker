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

export default function WelcomeV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Welcome to CarWise" eyebrow="WELCOME" subtitle="A calmer, evidence-first way to buy a used car." onBack={onBack}/>

    <Surface style={{padding:0,overflow:'hidden'}}><View style={{height:250,backgroundColor:'#071827',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan} style={{fontSize:62}}>CAR</Text><Text variant="h2">WISE</Text><Text variant="caption" color={COLORS.muted} style={{marginTop:7}}>AI-powered used car inspection</Text></View><View style={{padding:18}}><Text variant="h2">See the car. Understand the risk. Know the price.</Text><Text muted style={{marginTop:7}}>Capture evidence, organize findings and prepare a transparent offer.</Text><View style={{marginTop:16}}><Button title="Get started" onPress={()=>onNavigate?.('onboarding')}/></View></View></Surface>

  </Screen>;
}

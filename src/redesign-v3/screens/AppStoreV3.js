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

export default function AppStoreV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="App Store polish" eyebrow="RELEASE" subtitle="A screen set and content checklist for the production iOS presentation." onBack={onBack}/>

    <Surface><Badge label="6.7 INCH" tone="info"/><Text variant="display" style={{marginTop:10}}>Instant price intelligence.</Text><Text muted style={{marginTop:6}}>Show the market before the buyer makes the offer.</Text><View style={{height:180,marginTop:15,borderRadius:RADIUS.xl,backgroundColor:'#071827',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>$21.1K</Text><Text variant="caption" muted style={{marginTop:5}}>market estimate</Text></View></Surface>
    <Surface style={{marginTop:10}}><Badge label="AI CONDITION" tone="info"/><Text variant="h2" style={{marginTop:10}}>Visual evidence, organized.</Text><Text muted style={{marginTop:5}}>Use annotated photos, confidence and linked findings to make the product feel tangible.</Text></Surface>
    <Surface style={{marginTop:10}}><Badge label="REPORT → SIGNATURE" tone="success"/><Text variant="h2" style={{marginTop:10}}>From report to signed contract.</Text><Text muted style={{marginTop:5}}>Keep the final step human-authorized and clearly documented.</Text></Surface>

  </Screen>;
}

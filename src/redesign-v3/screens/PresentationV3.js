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

export default function PresentationV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="CarWise showcase" eyebrow="PRESENTATION" subtitle="A polished walkthrough screen for demos, review builds and stakeholder sessions." onBack={onBack}/>

    <VehicleHero vehicle={DEMO_VEHICLE}/>
    <SectionHeader title="The story"/>{[['01','See the car','Capture visual evidence.'],['02','Understand the risk','Link findings to evidence.'],['03','Know the price','Compare asking to market.'],['04','Negotiate with evidence','Build a transparent offer.'],['05','Sign with confidence','Human review stays in control.']].map(([n,t,d])=><Surface key={n} padded={false} style={{padding:13,marginBottom:8}}><View style={{flexDirection:'row',gap:12}}><Badge label={n} tone="info"/><View style={{flex:1}}><Text variant="bodyStrong">{t}</Text><Text variant="caption" muted style={{marginTop:3}}>{d}</Text></View></View></Surface>)}
    <View style={{marginTop:12}}><Button title="Start demo" icon="play" onPress={()=>onNavigate?.('demo')}/></View>

  </Screen>;
}

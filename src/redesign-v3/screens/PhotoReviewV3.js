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

export default function PhotoReviewV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Photo review" eyebrow="MEDIA REVIEW" subtitle="Turn one capture into evidence with context and annotation." onBack={onBack}/>

    <Surface><View style={{height:300,borderRadius:RADIUS.lg,overflow:'hidden',backgroundColor:'#050B13',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>IMAGE</Text><View style={{position:'absolute',left:'18%',top:'30%',width:'46%',height:'30%',borderWidth:2,borderColor:COLORS.coral,borderRadius:10}}><Badge label="Scratch · 92%" tone="danger"/></View></View></Surface>
    <SectionHeader title="Finding"/><Surface><Text variant="h2">Front bumper scratch</Text><Badge label="Major" tone="watch"/><Text muted style={{marginTop:7}}>Possible clear-coat / paint damage. Verify depth and repair scope.</Text><View style={{marginTop:12}}><ConfidenceBar value={.92}/></View></Surface>
    <SectionHeader title="Actions"/><View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><Button title="Confirm" onPress={()=>{}}/></View><View style={{flex:1}}><Button title="Edit" variant="outline" onPress={()=>{}}/></View></View>

  </Screen>;
}

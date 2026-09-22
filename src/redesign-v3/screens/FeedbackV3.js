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

export default function FeedbackV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Send feedback" eyebrow="FEEDBACK" subtitle="Capture issues and UX improvements while the context is fresh." onBack={onBack}/>

    <Surface><Text variant="h2">How is this inspection flow feeling?</Text><Text muted style={{marginTop:4}}>Your feedback should be tied to the current screen, device state and inspection step.</Text><View style={{flexDirection:'row',gap:8,marginTop:16}}>{['1','2','3','4','5'].map(x=><View key={x} onTouchEnd={()=>{}} style={{width:46,height:46,borderRadius:99,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text variant="bodyStrong">{x}</Text></View>)}</View></Surface>
    <SectionHeader title="Quick tags"/><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{['Beautiful','Confusing','Too slow','Love evidence','Need help'].map(x=><Badge key={x} label={x} tone="info"/>)}</View>
    <SectionHeader title="Describe it"/><Surface><Text variant="caption" muted>Multiline text field placeholder</Text><View style={{height:120,marginTop:8,borderRadius:RADIUS.md,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface2}}/></Surface><View style={{marginTop:12}}><Button title="Send feedback" onPress={()=>{}}/></View>

  </Screen>;
}

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

export default function LiveInspectionV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Live inspection" eyebrow="FIELD MODE" subtitle="A focused capture mode for walking around the vehicle." onBack={onBack}/>

    <Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Badge label="LIVE" tone="danger"/><Text variant="h2" style={{marginTop:9}}>Front-left corner</Text></View><Text variant="caption" color={COLORS.cyan}>06:14</Text></View></Surface>
    <View style={{marginTop:12,height:290,borderRadius:RADIUS.xl,borderWidth:1,borderColor:COLORS.cyan,backgroundColor:'#050B13',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>CAMERA</Text><Text variant="caption" color={COLORS.mint} style={{marginTop:7}}>Good framing</Text></View>
    <SectionHeader title="Quick capture"/><MultimodalTray onPick={()=>{}}/>
    <SectionHeader title="Current checklist"/><ChecklistRow item={{title:'Front-left tire',note:'Tap to inspect tread and sidewall.',status:'watch'}} onPress={()=>onNavigate?.('checklist')}/>

  </Screen>;
}

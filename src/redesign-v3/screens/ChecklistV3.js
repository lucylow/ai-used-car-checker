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

export default function ChecklistV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Inspection checklist" eyebrow="INSPECTION" subtitle="Work through the vehicle without losing your evidence trail." onBack={onBack}/>

    <Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="caption" muted>Overall progress</Text><Text variant="display" style={{marginTop:2}}>17 / 24</Text></View><Badge label="71%" tone="info"/></View><View style={{height:7,backgroundColor:COLORS.surface2,borderRadius:99,marginTop:12}}><View style={{width:'71%',height:'100%',backgroundColor:COLORS.cyan,borderRadius:99}}/></View></Surface>
    <SectionHeader title="Categories"/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>{['Exterior','Interior','Engine','Tires','Brakes','Electrical','Test Drive'].map(x=><View key={x} onTouchEnd={()=>setTab(x)} style={{paddingHorizontal:14,paddingVertical:9,borderRadius:99,backgroundColor:tab===x?COLORS.blue:COLORS.surface,borderWidth:1,borderColor:tab===x?COLORS.blue:COLORS.line}}><Text variant="caption" color={tab===x?COLORS.white:COLORS.muted}>{x}</Text></View>)}</ScrollView>
    <SectionHeader title={tab}/>{CHECKLIST.filter(x=>x.category===tab).map(item=><View key={item.id} style={{marginBottom:9}}><ChecklistRow item={item} onPress={()=>onNavigate?.('detail')}/></View>)}
    <SectionHeader title="Add evidence"/><MultimodalTray onPick={()=>{}}/>
    <View style={{marginTop:18}}><Button title="View report" onPress={()=>onNavigate?.('report')} /></View>

  </Screen>;
}

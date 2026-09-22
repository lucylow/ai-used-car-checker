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

export default function SettingsV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Settings" eyebrow="SETTINGS" subtitle="Configure the experience around how you inspect cars." onBack={onBack}/>

    <SectionHeader title="Experience"/>{[['appearance','Appearance','Dark mode'],['notifications','Notifications','Inspection reminders'],['speedometer','Motion','Respect reduced motion'],['accessibility','Accessibility','Dynamic type & screen reader']].map(([i,t,s],idx)=><View key={t} onTouchEnd={()=>onNavigate?.(t==='Appearance'?'appearance':t==='Notifications'?'notifications':null)} style={{paddingVertical:12,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',gap:11,alignItems:'center'}}><Text variant="caption" color={COLORS.cyan}>{i}</Text><View style={{flex:1}}><Text variant="bodyStrong">{t}</Text><Text variant="caption" muted>{s}</Text></View><Text variant="caption" color={idx<2?COLORS.cyan:COLORS.muted}>{idx<2?'›':'On'}</Text></View>)}
    <SectionHeader title="Data & privacy"/><Button title="Export my inspection data" variant="outline" onPress={()=>{}}/><View style={{height:8}}/><Button title="Delete account" variant="ghost" onPress={()=>{}}/>

  </Screen>;
}

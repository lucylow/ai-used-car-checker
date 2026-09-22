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

export default function ProfileV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Profile" eyebrow="ACCOUNT" subtitle="Keep identity, plan and preferences simple." onBack={onBack}/>

    <Surface><View style={{flexDirection:'row',alignItems:'center',gap:13}}><View style={{width:64,height:64,borderRadius:22,backgroundColor:'rgba(0,212,255,.12)',alignItems:'center',justifyContent:'center'}}><Text variant="h2" color={COLORS.cyan}>LL</Text></View><View style={{flex:1}}><Text variant="h2">Lucy Low</Text><Text muted style={{marginTop:3}}>CarWise member</Text></View><Badge label="PRO" tone="info"/></View></Surface>
    <SectionHeader title="Account"/>{[['settings','Settings','Preferences and notifications'],['card','Subscription','Pro · $9.99/month'],['shield-checkmark','Privacy & data','Export or delete your data'],['help-circle','Help','Guides and support']].map(([i,t,s])=><View key={t} onTouchEnd={()=>onNavigate?.(t==='Settings'?'settings':t==='Subscription'?'subscription':t==='Privacy & data'?'privacy':'help')} style={{paddingVertical:11,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:COLORS.line}}><Text variant="caption" color={COLORS.cyan}>{i}</Text><View style={{flex:1}}><Text variant="bodyStrong">{t}</Text><Text variant="caption" muted>{s}</Text></View><Text variant="caption" muted>›</Text></View>)}
    <SectionHeader title="Your plan"/><View onTouchEnd={()=>onNavigate?.('paywall')}><Surface><Badge label="PRO" tone="info"/><Text variant="h2" style={{marginTop:9}}>Unlimited inspection workflow</Text><Text muted style={{marginTop:4}}>More evidence, richer reports and advanced tooling.</Text></Surface></View>

  </Screen>;
}

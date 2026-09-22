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

export default function ShareV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Share report" eyebrow="SHARING" subtitle="Choose exactly what evidence and summary you want to send." onBack={onBack}/>

    <Surface><Text variant="h2">2020 Honda Accord Sport</Text><Text muted style={{marginTop:4}}>Inspection CW-2026-00418</Text><View style={{marginTop:13}}><Badge label="68/100 risk" tone="watch"/></View></Surface>
    <SectionHeader title="Share as"/>{[['link','Secure report link','View-only inspection summary'],['document-text','PDF report','Full report with evidence'],['shield-checkmark','Certificate','Verification record'],['chatbubble','Negotiation brief','Condensed talking points']].map(([i,t,s])=><View key={t} style={{marginBottom:8}}><Surface padded={false} style={{padding:13}}><View style={{flexDirection:'row',alignItems:'center',gap:10}}><Text variant="caption" color={COLORS.cyan}>{i}</Text><View style={{flex:1}}><Text variant="bodyStrong">{t}</Text><Text variant="caption" muted>{s}</Text></View><Text variant="caption" color={COLORS.cyan}>›</Text></View></Surface></View>)}
    <SectionHeader title="Privacy"/><AITrustBanner/>

  </Screen>;
}

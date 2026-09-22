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

export default function QAVisualV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Visual QA lab" eyebrow="QUALITY" subtitle="Exercise every state before shipping a release build." onBack={onBack}/>

    {['Default screen','Loading','Empty history','Network error','Permission request','AI uncertainty','Reduced motion','Dark mode','Long text','Large type'].map((x,i)=><Surface key={x} style={{marginBottom:8}}><View style={{flexDirection:'row',alignItems:'center'}}><Badge label={String(i+1).padStart(2,'0')} tone="info"/><Text variant="bodyStrong" style={{flex:1,marginLeft:9}}>{x}</Text><Text variant="caption" color={COLORS.mint}>Test</Text></View></Surface>)}
    <SectionHeader title="Release gate"/><Surface><InfoRow label="Touch target" value="≥ 44pt" tone={COLORS.mint}/><InfoRow label="Dynamic Type" value="Enabled" tone={COLORS.mint}/><InfoRow label="Reduced motion" value="Supported" tone={COLORS.mint}/><InfoRow label="Offline recovery" value="Required" tone={COLORS.amber}/><InfoRow label="AI labeling" value="Explicit" tone={COLORS.mint}/></Surface>

  </Screen>;
}

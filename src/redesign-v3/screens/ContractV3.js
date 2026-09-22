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

export default function ContractV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Purchase contract" eyebrow="CONTRACT" subtitle="Review terms generated from the inspection record before signing." onBack={onBack}/>

    <Surface><Badge label="DRAFT · HUMAN REVIEW REQUIRED" tone="watch"/><Text variant="h2" style={{marginTop:10}}>Purchase agreement</Text><Text muted style={{marginTop:4}}>2020 Honda Accord Sport · CW-2026-00418</Text></Surface>
    <SectionHeader title="Key terms"/><Surface><InfoRow label="Purchase price" value="$19,400" tone={COLORS.cyan}/><InfoRow label="Deposit" value="$500"/><InfoRow label="Validity" value="48 hours"/><InfoRow label="Disclosed findings" value="4"/><InfoRow label="Signature" value="Human authorization" tone={COLORS.mint}/></Surface>
    <SectionHeader title="Agreement"/>{[['1','Vehicle','Buyer and seller agree to the vehicle identity recorded in the inspection.'],['2','Price','The purchase price is recorded above and is subject to the parties’ final approval.'],['3','Condition','Known inspection findings are included for review before authorization.'],['4','Signatures','Only the human parties authorize and sign the final agreement.']].map(([n,t,b])=><Surface key={n} padded={false} style={{padding:14,marginBottom:8}}><View style={{flexDirection:'row',gap:10}}><Badge label={n} tone="info"/><View style={{flex:1}}><Text variant="bodyStrong">{t}</Text><Text variant="caption" muted style={{marginTop:4}}>{b}</Text></View></View></Surface>)}
    <View style={{marginTop:10}}><Button title="Review & sign" icon="create" onPress={()=>onNavigate?.('signature')}/></View>

  </Screen>;
}

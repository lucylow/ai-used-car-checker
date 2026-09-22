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

export default function CertificateV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Verified certificate" eyebrow="CERTIFICATE" subtitle="A polished completion record with an audit-friendly identity." onBack={onBack}/>

    <Surface style={{backgroundColor:'#101C2D'}}><View style={{alignItems:'center'}}><View style={{width:80,height:80,borderRadius:28,backgroundColor:'rgba(53,208,186,.10)',borderWidth:1,borderColor:COLORS.mint,alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.mint}>✓</Text></View><Text variant="h1" style={{marginTop:14}}>Inspection Verified</Text><Text muted style={{marginTop:4}}>Human-reviewed completion record</Text></View><View style={{marginTop:18}}><InfoRow label="Vehicle" value="2020 Honda Accord Sport"/><InfoRow label="Inspection ID" value="CW-2026-00418" mono/><InfoRow label="Evidence" value="18 photos · 2 clips"/><InfoRow label="Approved" value="Human review complete" tone={COLORS.mint}/><InfoRow label="Certificate hash" value="7F3A…91BD" mono/></View></Surface>
    <SectionHeader title="What is verified"/><View style={{gap:8}}>{['Inspection evidence attached','Document extraction recorded','Human approval captured','Certificate generated'].map(x=><Surface key={x} padded={false} style={{padding:12}}><View style={{flexDirection:'row',gap:9,alignItems:'center'}}><Badge label="VERIFIED" tone="success"/><Text variant="caption" style={{flex:1}}>{x}</Text></View></Surface>)}</View>
    <SectionHeader title="Actions"/><Button title="Share certificate" icon="share-social" onPress={()=>onNavigate?.('share')}/><View style={{height:8}}/><Button title="Generate contract" icon="document-text" variant="outline" onPress={()=>onNavigate?.('contract')}/>

  </Screen>;
}

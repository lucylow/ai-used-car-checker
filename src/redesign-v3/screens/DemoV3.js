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

export default function DemoV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Full journey demo" eyebrow="DEMO MODE" subtitle="Populate a sample vehicle so the complete product story can be tested quickly." onBack={onBack}/>

    <Surface style={{backgroundColor:'#0F1F33'}}><Badge label="DEMO VEHICLE" tone="info"/><Text variant="display" style={{marginTop:12}}>From VIN to certificate.</Text><Text muted style={{marginTop:6}}>Use the controls below to jump between production-style screens.</Text></Surface>
    <SectionHeader title="Journey"/>{[['VIN','vin'],['Market intelligence','market'],['Capture evidence','camera'],['AI findings','ai'],['Checklist','checklist'],['Repair costs','costs'],['Negotiation','negotiation'],['Report','report'],['Contract','contract'],['Certificate','certificate']].map(([t,r],i)=><View key={t} onTouchEnd={()=>onNavigate?.(r)} style={{paddingVertical:11,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10}}><Badge label={`${String(i+1).padStart(2,'0')}`} tone="info"/><Text variant="bodyStrong" style={{flex:1}}>{t}</Text><Text variant="caption" color={COLORS.cyan}>Open ›</Text></View>)}

  </Screen>;
}

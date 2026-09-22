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

export default function CameraV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Capture evidence" eyebrow="EVIDENCE" subtitle="Collect clean, useful media for AI and human review." onBack={onBack}/>

    <Surface><Badge label="4 OF 8 PHOTOS" tone="info"/><Text variant="h2" style={{marginTop:10}}>Front exterior</Text><Text muted style={{marginTop:4}}>Center the bumper and include enough context to identify location.</Text><View style={{marginTop:14,height:290,borderRadius:RADIUS.xl,backgroundColor:'#06101A',borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>⌁</Text><Text variant="caption" color={COLORS.mint}>Good framing</Text></View><View style={{marginTop:12}}><Button title="Capture photo" icon="camera" onPress={()=>onNavigate?.('evidence')}/></View></Surface>
    <SectionHeader title="Capture modes"/><MultimodalTray onPick={(x)=>{}}/>
    <SectionHeader title="Smart guidance"/><Surface><InfoRow label="Lighting" value="Good" tone={COLORS.mint}/><InfoRow label="Glare" value="Low" tone={COLORS.mint}/><InfoRow label="Coverage" value="Front bumper + grille"/><InfoRow label="Suggested next" value="Driver side" tone={COLORS.cyan}/></Surface>

  </Screen>;
}

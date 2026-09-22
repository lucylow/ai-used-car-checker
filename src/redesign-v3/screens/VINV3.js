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

export default function VINV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="VIN scanner" eyebrow="IDENTITY" subtitle="Capture the 17-character VIN with camera guidance." onBack={onBack}/>

    <Surface style={{padding:12}}><View style={{height:270,borderRadius:RADIUS.lg,backgroundColor:'#050B13',borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'}}><View style={{width:'84%',height:90,borderWidth:2,borderColor:COLORS.cyan,borderRadius:14}}><Text variant="caption" color={COLORS.cyan} style={{position:'absolute',top:-26}}>ALIGN VIN</Text></View><Text variant="caption" muted style={{position:'absolute',bottom:18}}>Keep the VIN plate inside the frame</Text></View></Surface>
    <SectionHeader title="Detected VIN" />
    <Surface><Text variant="mono" color={COLORS.cyan}>{DEMO_VEHICLE.vin}</Text><View style={{marginTop:12}}><ConfidenceBar value={.98}/></View><View style={{marginTop:15}}><Button title="Use this VIN" onPress={()=>onNavigate?.('market')} /></View></Surface>
    <SectionHeader title="Alternative" />
    <Surface><Text variant="bodyStrong">Enter manually</Text><Text variant="caption" muted style={{marginTop:4}}>Useful when the plate is damaged, reflective or difficult to frame.</Text><View style={{marginTop:12}}><Button title="Enter VIN" variant="outline" onPress={()=>onNavigate?.('inspect')}/></View></Surface>

  </Screen>;
}

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

export default function InspectV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="New inspection" eyebrow="INSPECT" subtitle="Build a visual evidence set before you make an offer." onBack={onBack}/>

    <Surface><Badge label="STEP 1 OF 4" tone="info"/><Text variant="h2" style={{marginTop:12}}>Identify the vehicle</Text><Text muted style={{marginTop:5}}>Scan the VIN, upload paperwork, or enter it manually.</Text><View style={{marginTop:15,flexDirection:'row',gap:9}}><View style={{flex:1}}><Button title="Scan VIN" icon="barcode" onPress={()=>onNavigate?.('vin')}/></View><View style={{flex:1}}><Button title="Upload" icon="document-attach" variant="outline" onPress={()=>onNavigate?.('documents')}/></View></View></Surface>
    <SectionHeader title="Or start from photos" />
    <View onTouchEnd={()=>onNavigate?.('camera')} style={{height:190,borderRadius:RADIUS.xl,borderWidth:1,borderColor:COLORS.line,borderStyle:'dashed',backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'}}><Text variant="display" style={{color:COLORS.cyan}}>＋</Text><Text variant="h3">Capture the vehicle</Text><Text variant="caption" muted style={{marginTop:5}}>Front, rear, sides, interior and problem areas</Text></View>
    <SectionHeader title="Inspection setup" />
    <Surface><InfoRow label="Purpose" value="Pre-purchase"/><InfoRow label="Seller type" value="Private seller"/><InfoRow label="Target location" value="Toronto, ON"/><InfoRow label="Evidence mode" value="Photo + video + voice" tone={COLORS.cyan}/></Surface>
    <SectionHeader title="What happens next" />
    <InspectionTimeline items={TIMELINE.slice(0,4)}/>

  </Screen>;
}

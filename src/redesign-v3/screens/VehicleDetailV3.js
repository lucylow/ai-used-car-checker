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

export default function VehicleDetailV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Vehicle profile" eyebrow="VEHICLE" subtitle="One visual identity for the vehicle across every CarWise flow." onBack={onBack}/>

    <VehicleHero vehicle={DEMO_VEHICLE}/>
    <SectionHeader title="Vehicle identity"/><Surface><InfoRow label="VIN" value={DEMO_VEHICLE.vin} mono/><InfoRow label="Trim" value="2.0T Sport"/><InfoRow label="Drive" value="FWD"/><InfoRow label="Location" value="Toronto, ON"/></Surface>
    <SectionHeader title="Health map"/><VehicleMap onZone={()=>{}}/>
    <SectionHeader title="Actions"/><View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><Button title="Inspect" onPress={()=>onNavigate?.('checklist')}/></View><View style={{flex:1}}><Button title="Market" variant="outline" onPress={()=>onNavigate?.('market')}/></View></View>

  </Screen>;
}

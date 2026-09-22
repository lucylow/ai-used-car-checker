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

export default function CostsV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Repair costs" eyebrow="COST ESTIMATE" subtitle="Translate findings into a transparent range for negotiation." onBack={onBack}/>

    <Surface><Text variant="caption" muted>Total estimated repairs</Text><Text variant="display" style={{marginTop:3}}>$980–$2,570</Text><Text variant="caption" color={COLORS.amber} style={{marginTop:5}}>Estimates vary by region, parts and labor.</Text></Surface>
    <SectionHeader title="Repair impact"/><CostBreakdown lines={REPAIRS}/>
    <SectionHeader title="Itemized findings"/>{REPAIRS.map((x,i)=><RepairLine key={i} {...x}/>) }
    <SectionHeader title="How to use this"/><Surface><Text variant="h3">Use evidence, not the total alone</Text><Text muted style={{marginTop:5}}>Open the underlying finding, confirm severity, then carry the range into your fair-price discussion.</Text><View style={{marginTop:13}}><Button title="Build offer range" icon="pricetag" onPress={()=>onNavigate?.('negotiation')}/></View></Surface>

  </Screen>;
}

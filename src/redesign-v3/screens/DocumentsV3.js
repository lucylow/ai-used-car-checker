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

export default function DocumentsV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Document center" eyebrow="DOCUMENTS" subtitle="Keep history, registration, invoices and generated files together." onBack={onBack}/>

    <SectionHeader title="Verified documents"/><DocumentEvidence title="Vehicle history report.pdf" type="PDF" verified confidence={.97}/><View style={{height:8}}/><DocumentEvidence title="Service invoice — 2025.pdf" type="PDF" verified confidence={.93}/>
    <SectionHeader title="Needs review"/><DocumentEvidence title="Seller inspection.jpg" type="IMAGE" verified={false} confidence={.71}/>
    <SectionHeader title="Upload evidence"/><Surface><Text variant="h3">Add a document</Text><Text muted style={{marginTop:4}}>Use invoices, registration, warranty paperwork or seller-provided reports.</Text><View style={{marginTop:12}}><Button title="Choose document" icon="document-attach" onPress={()=>{}}/></View></Surface>
    <SectionHeader title="Extraction trust"/><AITrustBanner/>

  </Screen>;
}

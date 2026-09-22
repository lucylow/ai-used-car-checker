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

export default function ListingDetailV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Listing detail" eyebrow="MARKETPLACE" subtitle="View one comparable without losing the CarWise market context." onBack={onBack}/>

    <Surface><Text variant="h2">2020 Honda Accord Sport</Text><Badge label="Comparable" tone="info"/><Text variant="display" style={{marginTop:9}}>$21,450</Text><Text muted style={{marginTop:3}}>40,100 mi · Toronto</Text></Surface>
    <SectionHeader title="Compared with your vehicle"/><View style={{gap:0}}>{[['Price','-$450',COLORS.mint],['Mileage','-2,080 mi',COLORS.mint],['Location','Same metro',COLORS.cyan],['Evidence','Listing only',COLORS.amber]].map(([l,v,c])=><InfoRow key={l} label={l} value={v} tone={c}/>)}</View>
    <SectionHeader title="Use as evidence"/><Button title="Add to comparison" variant="outline" onPress={()=>onNavigate?.('compare')}/>

  </Screen>;
}

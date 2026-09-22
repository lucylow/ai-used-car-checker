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

export default function PaywallV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="CarWise Pro" eyebrow="UPGRADE" subtitle="Premium inspection tools without cluttering the core experience." onBack={onBack}/>

    <Surface style={{backgroundColor:'#0E1D31'}}><Badge label="CARWISE PRO" tone="info"/><Text variant="display" style={{marginTop:12}}>Inspect with more confidence.</Text><Text muted style={{marginTop:7}}>Unlock unlimited inspection workflows and richer evidence tools.</Text></Surface>
    <SectionHeader title="Included"/>{['Unlimited inspections','Advanced evidence capture','Interactive reports','Negotiation coach','Certificate sharing'].map(x=><View key={x} style={{flexDirection:'row',gap:8,alignItems:'center',paddingVertical:8}}><Badge label="✓" tone="success"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}
    <SectionHeader title="Choose a plan"/><Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="h2">Monthly</Text><Text variant="caption" muted style={{marginTop:3}}>Cancel anytime</Text></View><Text variant="h2">$9.99</Text></View><View style={{marginTop:13}}><Button title="Start free trial" icon="flash" onPress={()=>{}}/></View></Surface>
    <Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="h2">Yearly</Text><Badge label="SAVE" tone="success"/></View><Text variant="h2">$99.99</Text></View><View style={{marginTop:13}}><Button title="Choose yearly" variant="outline" onPress={()=>{}}/></View></Surface>
    <Text variant="caption" muted style={{textAlign:'center',marginTop:12}}>Show App Store subscription disclosures and Restore Purchases in the production implementation.</Text>

  </Screen>;
}

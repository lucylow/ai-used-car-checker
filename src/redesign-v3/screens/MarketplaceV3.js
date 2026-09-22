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

export default function MarketplaceV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Market explorer" eyebrow="MARKETPLACE" subtitle="Browse comparable vehicles without leaving the CarWise evidence context." onBack={onBack}/>

    <Surface><Text variant="h2">Nearby comparables</Text><Text muted style={{marginTop:4}}>Based on model, year, mileage and local market context.</Text></Surface>
    {COMPARABLES.map((c,i)=><View key={i} style={{marginTop:10}}><Surface><View style={{flexDirection:'row',gap:10}}><MediaTile item={{uri:c.image,type:'photo',label:'Listing',meta:c.city}}/><View style={{flex:1}}><Text variant="bodyStrong">{c.title}</Text><Text variant="caption" muted style={{marginTop:4}}>{c.mileage.toLocaleString()} mi · {c.city}</Text><View style={{marginTop:8,flexDirection:'row',justifyContent:'space-between'}}><Text variant="h3">${c.price.toLocaleString()}</Text><Badge label={i===0?'Near market':'Comparable'} tone={i===0?'success':'info'}/></View></View></View></Surface></View>)}

  </Screen>;
}

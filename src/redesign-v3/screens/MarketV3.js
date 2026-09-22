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

export default function MarketV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Market intelligence" eyebrow="MARKET" subtitle="See the asking price in the context of comparable vehicles." onBack={onBack}/>

    <VehicleHero vehicle={DEMO_VEHICLE}/>
    <SectionHeader title="Price position" />
    <Surface><Text variant="caption" muted>Asking price</Text><Text variant="display" style={{marginTop:2}}>$21,900</Text><Badge label="$800 above market estimate" tone="watch"/><View style={{marginTop:18}}><PriceRange/></View></Surface>
    <SectionHeader title="30-day trend" />
    <Surface><View style={{height:110,flexDirection:'row',alignItems:'flex-end',gap:5}}>{MARKET_POINTS.map((n,i)=><View key={i} style={{flex:1,height:n*8,borderRadius:6,backgroundColor:i>9?COLORS.mint:COLORS.blue,opacity:.45+i/25}}/>)}</View><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}><Text variant="caption" muted>30d ago</Text><Text variant="caption" color={COLORS.mint}>+2.4%</Text><Text variant="caption" muted>Today</Text></View></Surface>
    <SectionHeader title="Comparable listings" action="See all" onAction={()=>onNavigate?.('marketplace')}/>
    {COMPARABLES.map((c,i)=><View key={i} style={{marginBottom:9}}><Surface><View style={{flexDirection:'row',gap:11}}><MediaTile item={{uri:c.image,type:'photo',label:'Vehicle',meta:c.city}}/><View style={{flex:1}}><Text variant="bodyStrong">{c.title}</Text><Text variant="caption" muted style={{marginTop:4}}>{c.mileage.toLocaleString()} mi · {c.city}</Text><Text variant="h3" color={COLORS.mint} style={{marginTop:8}}>${c.price.toLocaleString()}</Text></View></View></Surface></View>)}
    <SectionHeader title="AI price explanation"/><Surface><AITrustBanner/><Text style={{marginTop:12}}>Comparable vehicles cluster near the current market range. Condition evidence and mileage can move the practical offer range.</Text><View style={{marginTop:12}}><Button title="Analyze condition" icon="sparkles" onPress={()=>onNavigate?.('ai')}/></View></Surface>

  </Screen>;
}

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

export default function HomeV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Your garage" eyebrow="CARWISE" subtitle="One place for every inspection and buying decision." onBack={onBack}/>

    <VehicleHero vehicle={DEMO_VEHICLE}/>
    <SectionHeader title="Today at a glance" />
    <View style={{flexDirection:'row',gap:10}}><StatCard label="Risk" value="68" sub="Moderate" icon="pulse" tone={COLORS.amber}/><StatCard label="Market" value="$21.1K" sub="2.4% trend" icon="trending-up" tone={COLORS.mint}/></View>
    <SectionHeader title="Continue inspection" action="View all" onAction={()=>onNavigate?.('history')}/>
    <Surface><View style={{flexDirection:'row',alignItems:'center',gap:12}}><RiskRing score={68}/><View style={{flex:1}}><Text variant="h3">3 actions remain</Text><Text muted style={{marginTop:5}}>Review dashboard warning, capture rear photo, complete test drive.</Text><View style={{marginTop:12}}><Button title="Continue" onPress={()=>onNavigate?.('checklist')} /></View></View></View></Surface>
    <SectionHeader title="Quick actions" />
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{[['VIN scan','barcode-outline','vin'],['Camera inspection','camera-outline','camera'],['Market check','analytics-outline','market'],['Ask CarWise','sparkles-outline','copilot']].map(([t,i,r])=><View key={t} onTouchEnd={()=>onNavigate?.(r)} style={{width:'48%',padding:14,borderWidth:1,borderColor:COLORS.line,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface}}><Text variant="caption" color={COLORS.cyan}>{i}</Text><Text variant="bodyStrong" style={{marginTop:10}}>{t}</Text><Text variant="caption" muted style={{marginTop:4}}>Open tool</Text></View>)}</View>
    <SectionHeader title="Latest evidence" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10}}>{DEMO_VEHICLE.photos.map((uri,i)=><MediaTile key={uri} item={{uri,type:'photo',label:['Front','Rear','Side','Dashboard'][i],meta:i===3?'Flagged':'Evidence'}} onPress={()=>onNavigate?.('evidence')}/>)}</ScrollView>
    <SectionHeader title="CarWise copilot" />
    <Surface><Text variant="h3">Need a second opinion?</Text><Text muted style={{marginTop:5}}>Ask about price, findings, seller questions, or what to inspect next.</Text><View style={{marginTop:12}}><Button title="Ask CarWise" icon="sparkles" variant="cyan" onPress={()=>onNavigate?.('copilot')}/></View></Surface>

  </Screen>;
}

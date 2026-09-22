import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function PurchaseChecklistV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Final purchase checklist" eyebrow="DECISION" subtitle="A calm last pass over open evidence before moving to contract." onBack={onBack}/>

<Surface><Badge label="3 OPEN ITEMS" tone="watch"/><Text variant="h2" style={{marginTop:10}}>Before you commit</Text><Text muted style={{marginTop:4}}>Resolve or consciously accept each open item.</Text></Surface>
<SectionHeader title="Open items"/>
{['Dashboard warning light','Front bumper repair scope','Seller service records'].map(x=><ActionRow key={x} icon="alert-circle-outline" title={x} subtitle="Open evidence and mark reviewed" onPress={()=>onNavigate?.('detail')} tone={COLORS.amber}/>)}
<SectionHeader title="Confirmed"/>
{['VIN verified','Market comparison saved','Inspection evidence captured','Human signature step ready'].map(x=><ActionRow key={x} icon="checkmark-circle" title={x} subtitle="Complete" tone={COLORS.mint}/>)}
<View style={{marginTop:15}}><Button title="Continue to contract" onPress={()=>onNavigate?.('contract')}/></View>

  </Screen>;
}

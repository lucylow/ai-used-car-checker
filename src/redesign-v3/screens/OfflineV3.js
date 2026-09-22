import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function OfflineV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Offline inspection" eyebrow="OFFLINE MODE" subtitle="Keep capture and notes useful even with intermittent connectivity." onBack={onBack}/>

<Surface style={{backgroundColor:'rgba(244,183,64,.06)',borderColor:'rgba(244,183,64,.2)'}}><Badge label="OFFLINE" tone="watch"/><Text variant="h2" style={{marginTop:9}}>Capture now. Sync later.</Text><Text muted style={{marginTop:5}}>Do not block the inspection because a live service is unavailable.</Text></Surface>
<SectionHeader title="Available offline"/>{['Photos','Voice notes','Checklist updates','Local report draft','Inspection timeline'].map(x=><ActionRow key={x} icon="checkmark-circle" title={x} subtitle="Available" tone={COLORS.mint}/>) }
<SectionHeader title="Waiting for sync"/>{['Market update','AI analysis refresh','Certificate generation'].map(x=><ActionRow key={x} icon="time-outline" title={x} subtitle="Will retry when online" tone={COLORS.amber}/>) }
<View style={{marginTop:14}}><Button title="Open checklist" onPress={()=>onNavigate?.('checklist')}/></View>

  </Screen>;
}

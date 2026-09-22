import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function LongTextV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Content stress test" eyebrow="QA" subtitle="Exercise long strings, accessibility text and dynamic type." onBack={onBack}/>

<Surface><Text variant="h2">A very long vehicle title designed to stress wrapping without clipping or forcing the card to grow beyond the visible layout</Text><Text muted style={{marginTop:7}}>This paragraph intentionally runs long so a production implementation can confirm line wrapping, vertical rhythm, tap target positioning and sticky CTA behavior under Dynamic Type.</Text></Surface>
<SectionHeader title="Metrics"/>{[['Inspection status','Human review pending'],['Vehicle name','2020 Honda Accord Sport Touring Special Edition'],['Certificate ID','CW-2026-00418-7F3A91BD'],['Market range','$19,800–$23,900']].map(([a,b])=><InfoRow key={a} label={a} value={b}/>) }
<SectionHeader title="Actions"/><Button title="This button intentionally has a longer accessible label for screen reader QA" onPress={()=>{}}/>

  </Screen>;
}

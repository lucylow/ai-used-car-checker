import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function EvidenceTimelineV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Evidence timeline" eyebrow="AUDIT TRAIL" subtitle="See when evidence entered the inspection and how it changed the report." onBack={onBack}/>

<Surface><EvidenceCount/><Text variant="caption" muted style={{marginTop:7}}>Everything below is attached to this inspection ID.</Text></Surface>
<SectionHeader title="Timeline"/>{TIMELINE.concat([{time:'11:02',title:'Report updated',detail:'Negotiation points added',icon:'document-text-outline',state:'current'}]).map((x,i)=><TimelineStep key={i} number={i+1} title={x.title} detail={`${x.time} · ${x.detail}`} state={x.state==='current'?'current':'done'}/>)}
<SectionHeader title="Evidence principle"/><Surface><Text muted>Keep source media attached to every high-impact finding so users can inspect the underlying evidence at any time.</Text></Surface>

  </Screen>;
}

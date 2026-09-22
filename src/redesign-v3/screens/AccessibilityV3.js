import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function AccessibilityV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Accessibility review" eyebrow="ACCESSIBILITY" subtitle="Design accessibility as part of the UI, not as a final patch." onBack={onBack}/>

<SectionHeader title="Readable hierarchy"/>{[['Title','28–34pt','High contrast'],['Body','15–17pt','Readable line length'],['Caption','12pt','Do not use for essential meaning']].map(([a,b,c])=><ActionRow key={a} icon="text-outline" title={a} subtitle={`${b} · ${c}`} tone={COLORS.cyan}/>) }
<SectionHeader title="Non-color status"/>{[['Pass','Icon + label','success'],['Watch','Icon + label','watch'],['Critical','Icon + label','danger']].map(([a,b,t])=><View key={a} style={{paddingVertical:11,flexDirection:'row',gap:9,alignItems:'center'}}><IssueBadge severity={t}/><Text variant="bodyStrong" style={{flex:1}}>{a}</Text><Text variant="caption" muted>{b}</Text></View>) }
<SectionHeader title="Motion"/><Surface><Text muted>Respect reduced motion and keep essential state changes understandable without animation.</Text></Surface>

  </Screen>;
}

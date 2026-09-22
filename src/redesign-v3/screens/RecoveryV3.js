import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function RecoveryV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Recover inspection" eyebrow="RECOVERY" subtitle="Continue safely when a request fails or a network drops." onBack={onBack}/>

<Surface><Badge label="YOUR DATA IS SAFE" tone="success"/><Text variant="h2" style={{marginTop:9}}>Continue where you left off.</Text><Text muted style={{marginTop:4}}>The current inspection can remain available while the app retries background work.</Text></Surface>
<SectionHeader title="Saved progress"/><View style={{flexDirection:'row',gap:9}}><GlassStat label="Progress" value="72%" detail="17 / 24 checks"/><GlassStat label="Media" value="20" detail="saved items" tone={COLORS.mint}/></View>
<SectionHeader title="Recovery options"/>{[['Retry network action','Try the last request again.'],['Continue offline','Keep inspecting with local data.'],['Review saved evidence','Check what has already been stored.']].map(([a,b])=><ActionRow key={a} icon="refresh-outline" title={a} subtitle={b} tone={COLORS.cyan}/>) }
<View style={{marginTop:14}}><Button title="Continue inspection" onPress={()=>onNavigate?.('checklist')}/></View>

  </Screen>;
}

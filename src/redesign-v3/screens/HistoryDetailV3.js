import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function HistoryDetailV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Inspection detail" eyebrow="HISTORY" subtitle="Open one historical vehicle and restore its workflow." onBack={onBack}/>

<VehicleHero vehicle={DEMO_VEHICLE}/>
<SectionHeader title="Status"/><View style={{flexDirection:'row',gap:9}}><GlassStat label="Risk" value="68" detail="moderate" tone={COLORS.amber}/><GlassStat label="Progress" value="72%" detail="active" tone={COLORS.cyan}/></View>
<SectionHeader title="Recent actions"/>{[['Continue checklist','4 items remain'],['Review AI','4 findings'],['Open report','Last updated today'],['Share certificate','Ready']].map(([a,b],i)=><ActionRow key={a} icon={['checkmark-circle','sparkles','document-text','shield-checkmark'][i]} title={a} subtitle={b} onPress={()=>onNavigate?.(i===0?'checklist':i===1?'ai':i===2?'report':'certificate')} tone={COLORS.cyan}/>) }

  </Screen>;
}

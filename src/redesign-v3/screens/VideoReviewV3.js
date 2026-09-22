import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function VideoReviewV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Video review" eyebrow="VIDEO EVIDENCE" subtitle="Review short clips with event markers and AI uncertainty." onBack={onBack}/>

<Surface><View style={{height:220,borderRadius:RADIUS.lg,backgroundColor:'#050B13',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>▶</Text><Text variant="caption" muted style={{marginTop:7}}>00:10 · engine running</Text></View><View style={{marginTop:13,height:7,borderRadius:99,backgroundColor:COLORS.surface2,overflow:'hidden'}}><View style={{width:'68%',height:'100%',backgroundColor:COLORS.cyan}}/></View></Surface>
<SectionHeader title="Detected events"/>{[['00:03','Possible vibration','watch'],['00:07','Warning light visible','danger'],['00:09','Possible exhaust smoke','watch']].map(([t,d,ton])=><ActionRow key={t} icon="time-outline" title={t} subtitle={d} tone={ton==='danger'?COLORS.coral:COLORS.amber}/>) }
<SectionHeader title="Next"/><Button title="Add to findings" variant="outline" onPress={()=>onNavigate?.('ai')}/>

  </Screen>;
}

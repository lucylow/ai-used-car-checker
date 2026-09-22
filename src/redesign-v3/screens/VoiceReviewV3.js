import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function VoiceReviewV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Voice note review" eyebrow="AUDIO EVIDENCE" subtitle="Review transcription and attach it to the exact inspection item." onBack={onBack}/>

<Surface><Badge label="00:08" tone="info"/><Text variant="h2" style={{marginTop:9}}>Steering observation</Text><View style={{marginTop:13}}><View style={{height:34,flexDirection:'row',alignItems:'center',gap:3}}>{[3,8,13,20,30,17,25,11,32,18,27,12,21,7,16,24,10,6].map((h,i)=><View key={i} style={{flex:1,height:h,borderRadius:99,backgroundColor:COLORS.cyan,opacity:.4+i/40}}/>)}</View></View><Text muted style={{marginTop:14}}>“Steering feels slightly heavy on left turn.”</Text></Surface>
<SectionHeader title="Attach to"/>{['Steering','Suspension','Test drive summary'].map(x=><ActionRow key={x} icon="link-outline" title={x} subtitle="Attach note" tone={COLORS.cyan}/>) }
<SectionHeader title="AI transcript confidence"/><ConfidencePill value={.94}/>
<View style={{marginTop:14}}><Button title="Save voice evidence" onPress={()=>onNavigate?.('test')}/></View>

  </Screen>;
}

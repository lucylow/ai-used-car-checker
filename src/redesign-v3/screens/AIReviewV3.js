import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function AIReviewV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="AI review queue" eyebrow="AI REVIEW" subtitle="Review each model-assisted finding with evidence and confidence." onBack={onBack}/>

<Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="caption" muted>Pending review</Text><Text variant="display">4</Text></View><ConfidencePill value={.91}/></View></Surface>
<SectionHeader title="Queue"/>{FINDINGS.map((f,i)=><Surface key={f.id} style={{marginBottom:9}}><View style={{flexDirection:'row',justifyContent:'space-between',gap:8}}><View style={{flex:1}}><Text variant="bodyStrong">{f.title}</Text><Text variant="caption" muted style={{marginTop:3}}>{f.area}</Text></View><IssueBadge severity={f.severity}/></View><View style={{marginTop:11}}><ConfidencePill value={f.confidence}/></View><View style={{marginTop:10,flexDirection:'row',gap:8}}><View style={{flex:1}}><Button title="Review" variant="outline" onPress={()=>onNavigate?.('evidence')}/></View><View style={{flex:1}}><Button title="Accept" onPress={()=>{}}/></View></View></Surface>)}

  </Screen>;
}

import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function PhotoCaptureChecklistV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Capture checklist" eyebrow="CAMERA" subtitle="Make required media obvious before the user takes a photo." onBack={onBack}/>

<Surface><Text variant="h2">Exterior evidence</Text><Text muted style={{marginTop:4}}>8 recommended captures · 4 complete</Text><View style={{marginTop:13,height:7,borderRadius:99,backgroundColor:COLORS.surface2,overflow:'hidden'}}><View style={{width:'50%',height:'100%',backgroundColor:COLORS.cyan}}/></View></Surface>
<SectionHeader title="Required"/>{[['Front','done'],['Driver side','done'],['Rear','done'],['Passenger side','next'],['Dashboard','next'],['Tires','next'],['Interior','next'],['Engine bay','next']].map(([x,s],i)=><View key={x} style={{paddingVertical:10,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',gap:10,alignItems:'center'}}><Badge label={String(i+1).padStart(2,'0')} tone="info"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text><Badge label={s==='done'?'Captured':'Capture'} tone={s==='done'?'success':'watch'}/></View>)}
<View style={{marginTop:15}}><Button title="Open camera" icon="camera" onPress={()=>onNavigate?.('camera')}/></View>

  </Screen>;
}

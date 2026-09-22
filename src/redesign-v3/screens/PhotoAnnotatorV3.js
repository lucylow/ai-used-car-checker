import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function PhotoAnnotatorV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Photo annotator" eyebrow="VISION" subtitle="Inspect bounding boxes, edit labels and preserve the original image." onBack={onBack}/>

<Surface><View style={{height:320,borderRadius:RADIUS.lg,backgroundColor:'#06101A',alignItems:'center',justifyContent:'center',overflow:'hidden'}}><Text variant="display" color={COLORS.cyan}>PHOTO</Text><View style={{position:'absolute',left:'14%',top:'26%',width:'52%',height:'38%',borderWidth:2,borderColor:COLORS.coral,borderRadius:10}}><Badge label="Scratch · 92%" tone="danger"/></View><View style={{position:'absolute',right:'12%',bottom:'20%',width:'25%',height:'22%',borderWidth:2,borderColor:COLORS.amber,borderRadius:10}}><Badge label="Wear" tone="watch"/></View></View></Surface>
<SectionHeader title="Annotations"/>{[['Scratch','92%','Major'],['Wear','81%','Watch']].map(([a,b,c])=><View key={a} style={{paddingVertical:11,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:8}}><IssueBadge severity={c.toLowerCase()}/><Text variant="bodyStrong" style={{flex:1}}>{a}</Text><ConfidencePill value={parseFloat(b)/100}/></View>)}
<SectionHeader title="Actions"/><View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><Button title="Save edits" onPress={()=>{}}/></View><View style={{flex:1}}><Button title="View original" variant="outline" onPress={()=>{}}/></View></View>

  </Screen>;
}

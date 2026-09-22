import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function DocumentViewerV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Document viewer" eyebrow="DOCUMENTS" subtitle="Preview a document with production-ready controls in mind." onBack={onBack}/>

<Surface><View style={{height:390,borderRadius:RADIUS.lg,backgroundColor:'#F7FBFF',padding:19}}><Text variant="mono" color="#0B1626">VEHICLE HISTORY REPORT</Text>{[...Array(15)].map((_,i)=><View key={i} style={{height:5,width:`${92-(i%5)*8}%`,backgroundColor:'#CFD9E2',marginTop:10,borderRadius:99}}/>)}<View style={{position:'absolute',right:16,bottom:16}}><Badge label="PAGE 1" tone="info"/></View></View></Surface>
<SectionHeader title="Viewer controls"/><View style={{flexDirection:'row',gap:8}}>{['Search','Zoom','Thumbnails','Share'].map(x=><View key={x} style={{flex:1,padding:11,borderRadius:RADIUS.md,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,alignItems:'center'}}><Text variant="caption" color={COLORS.cyan}>{x}</Text></View>)}</View>
<SectionHeader title="Verification"/><ConfidencePill value={.97}/>

  </Screen>;
}

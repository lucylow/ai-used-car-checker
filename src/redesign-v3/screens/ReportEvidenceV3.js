import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function ReportEvidenceV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Report evidence" eyebrow="REPORT" subtitle="Open findings and their source evidence without leaving the report." onBack={onBack}/>

<SectionHeader title="Linked findings"/>{FINDINGS.map(f=><Surface key={f.id} style={{marginBottom:9}}><View style={{flexDirection:'row',justifyContent:'space-between'}}><View style={{flex:1}}><Text variant="bodyStrong">{f.title}</Text><Text variant="caption" muted style={{marginTop:3}}>{f.area}</Text></View><IssueBadge severity={f.severity}/></View><View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><EvidenceCount photos={f.id==='f1'?2:1} videos={f.id==='f4'?1:0} docs={0}/><ConfidencePill value={f.confidence}/></View><View style={{marginTop:10}}><Button title="View evidence" variant="outline" onPress={()=>onNavigate?.('evidence')}/></View></Surface>)}

  </Screen>;
}

import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function PermissionV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Camera permission" eyebrow="FIRST USE" subtitle="Explain why access helps before sending the user to Settings." onBack={onBack}/>

<View style={{alignItems:'center',paddingTop:14}}><View style={{width:100,height:100,borderRadius:30,backgroundColor:'rgba(0,212,255,.08)',borderWidth:1,borderColor:'rgba(0,212,255,.2)',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>◎</Text></View><Text variant="h1" style={{textAlign:'center',marginTop:16}}>Use your camera to inspect the car</Text><Text muted style={{textAlign:'center',marginTop:7}}>CarWise needs camera access so you can capture VINs and vehicle evidence.</Text></View>
<SectionHeader title="What you'll capture"/>{['VIN plate','Exterior panels','Dashboard','Tires and wheels'].map(x=><View key={x} style={{paddingVertical:10,flexDirection:'row',gap:9}}><Badge label="PHOTO" tone="info"/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text></View>)}
<View style={{marginTop:16}}><Button title="Allow camera" icon="camera" onPress={()=>{}}/></View><View style={{marginTop:8}}><Button title="Not now" variant="ghost" onPress={()=>onNavigate?.('inspect')}/></View>

  </Screen>;
}

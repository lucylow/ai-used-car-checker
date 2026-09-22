import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function GarageEmptyV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Empty garage" eyebrow="GARAGE" subtitle="A useful empty state that gives the user a concrete first action." onBack={onBack}/>

<View style={{alignItems:'center',paddingVertical:46}}><View style={{width:100,height:100,borderRadius:31,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>🚗</Text></View><Text variant="h1" style={{textAlign:'center',marginTop:16}}>Your garage is waiting.</Text><Text muted style={{textAlign:'center',marginTop:6}}>Start your first inspection to build a visual vehicle record.</Text><View style={{width:'100%',marginTop:18}}><Button title="Start first inspection" onPress={()=>onNavigate?.('inspect')}/></View></View>
<SectionHeader title="You'll get"/>{['VIN identity','Market context','Evidence trail','Negotiation-ready report'].map(x=><ActionRow key={x} icon="checkmark-circle" title={x} subtitle="Included in the journey" tone={COLORS.mint}/>) }

  </Screen>;
}

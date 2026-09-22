import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function ContractPreviewV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Contract preview" eyebrow="DOCUMENT" subtitle="Read the generated agreement before opening the human signature step." onBack={onBack}/>

<Surface><Badge label="DRAFT" tone="watch"/><Text variant="h2" style={{marginTop:9}}>Purchase agreement</Text><Text muted style={{marginTop:4}}>Prepared from the inspection record</Text></Surface>
<SectionHeader title="Preview"/><View style={{height:310,borderRadius:RADIUS.lg,backgroundColor:'#F7FBFF',padding:18}}><Text variant="mono" color="#0B1626">PURCHASE AGREEMENT</Text>{[1,2,3,4,5,6,7,8,9].map(i=><View key={i} style={{height:5,width:i===4?'70%':`${88-(i%4)*7}%`,backgroundColor:'#CBD5DF',marginTop:9,borderRadius:99}}/>)}<View style={{marginTop:22,flexDirection:'row',gap:10}}><View style={{flex:1,height:38,borderBottomWidth:1,borderBottomColor:'#9AA8B5'}}/><View style={{flex:1,height:38,borderBottomWidth:1,borderBottomColor:'#9AA8B5'}}/></View></View>
<SectionHeader title="Human review"/><Surface><Text variant="bodyStrong">Only the buyer and seller should authorize the final agreement.</Text><Text muted style={{marginTop:4}}>Keep this distinction explicit in the UI.</Text></Surface>
<View style={{marginTop:14}}><Button title="Continue to signature" onPress={()=>onNavigate?.('signature')}/></View>

  </Screen>;
}

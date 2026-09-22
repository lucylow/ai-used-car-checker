import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function AIUncertaintyV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="AI uncertainty" eyebrow="AI TRUST" subtitle="Make ambiguity visible rather than burying it in a score." onBack={onBack}/>

<Surface style={{backgroundColor:'rgba(244,183,64,.06)',borderColor:'rgba(244,183,64,.22)'}}><Badge label="NEEDS CONFIRMATION" tone="watch"/><Text variant="h2" style={{marginTop:9}}>The image is not conclusive.</Text><Text muted style={{marginTop:4}}>The model found a possible signal, but image quality or context limits confidence.</Text></Surface>
<SectionHeader title="What could improve confidence"/>{['Capture a closer image','Use natural light','Add the opposite angle','Add a mechanic observation'].map(x=><ActionRow key={x} icon="add-circle-outline" title={x} subtitle="Recommended" tone={COLORS.cyan}/>) }
<SectionHeader title="Current confidence"/><ConfidencePill value={.58}/>
<View style={{marginTop:15}}><Button title="Capture better evidence" icon="camera" onPress={()=>onNavigate?.('camera')}/></View>

  </Screen>;
}

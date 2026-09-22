import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function CertificateShareV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Certificate share" eyebrow="CERTIFICATE" subtitle="A public-safe verification card without exposing unnecessary personal data." onBack={onBack}/>

<Surface style={{alignItems:'center',paddingVertical:26}}><View style={{width:118,height:118,borderRadius:59,borderWidth:8,borderColor:'rgba(53,208,186,.18)',borderTopColor:COLORS.mint,borderRightColor:COLORS.mint,alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.mint}>✓</Text></View><Text variant="h1" style={{marginTop:16}}>Verified inspection</Text><Text muted style={{marginTop:4}}>2020 Honda Accord Sport</Text></Surface>
<SectionHeader title="Verification details"/><InfoRow label="Inspection ID" value="CW-2026-00418" mono/><InfoRow label="Evidence" value="18 photos · 2 clips"/><InfoRow label="Human approval" value="Recorded" tone={COLORS.mint}/><InfoRow label="Certificate" value="7F3A…91BD" mono/>
<SectionHeader title="Share controls"/><Text muted>Exclude private contact information and only expose data intended for a public recipient.</Text><View style={{marginTop:13}}><Button title="Copy verification link" onPress={()=>{}}/></View>

  </Screen>;
}

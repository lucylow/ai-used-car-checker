import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function ReportExportV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Export report" eyebrow="REPORT EXPORT" subtitle="Give export actions context, format and privacy controls." onBack={onBack}/>

<Surface><Badge label="READY" tone="success"/><Text variant="h2" style={{marginTop:10}}>Choose an export</Text><Text muted style={{marginTop:4}}>Keep sensitive details out of public-facing versions.</Text></Surface>
<SectionHeader title="Formats"/>{[['PDF','Full report with evidence'],['Share link','View-only web summary'],['Negotiation brief','Condensed seller-facing points'],['Certificate','Verification record']].map(([a,b])=><ActionRow key={a} icon="document-outline" title={a} subtitle={b} tone={COLORS.cyan}/>) }
<SectionHeader title="Privacy"/><View style={{paddingVertical:9,flexDirection:'row',gap:9}}><Badge label="PRIVATE" tone="info"/><Text variant="caption" muted style={{flex:1}}>Show a final confirmation before sharing any personal information.</Text></View>
<View style={{marginTop:14}}><Button title="Export PDF" icon="download" onPress={()=>{}}/></View>

  </Screen>;
}

import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function ReportSharePreviewV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Report share preview" eyebrow="SHARE" subtitle="Preview the exact public-facing summary before you send it." onBack={onBack}/>

<Surface><Text variant="caption" color={COLORS.cyan}>CARWISE REPORT</Text><Text variant="h1" style={{marginTop:8}}>2020 Honda Accord Sport</Text><Text variant="caption" muted style={{marginTop:4}}>Inspection CW-2026-00418</Text><View style={{marginTop:15,flexDirection:'row',gap:9}}><GlassStat label="Risk" value="68" detail="moderate" tone={COLORS.amber}/><GlassStat label="Market" value="$21.1K" detail="estimate" tone={COLORS.mint}/></View></Surface>
<SectionHeader title="Visible evidence"/>{['Decision snapshot','Key findings','Market context','Repair range','Verification status'].map(x=><ActionRow key={x} icon="eye-outline" title={x} subtitle="Included in shared view" tone={COLORS.cyan}/>) }
<View style={{marginTop:14}}><Button title="Share report" icon="share-social" onPress={()=>{}}/></View>

  </Screen>;
}

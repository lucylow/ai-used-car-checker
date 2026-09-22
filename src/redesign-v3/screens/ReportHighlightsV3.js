import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function ReportHighlightsV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Report highlights" eyebrow="REPORT" subtitle="Prioritize the three facts a buyer should remember after reading the report." onBack={onBack}/>

<HeroBackdrop eyebrow="REPORT" title="Three things to know" description="A compact summary for the buyer before the full report."/>
<SectionHeader title="1 · Condition"/><Surface><IssueBadge severity="critical"/><Text variant="h2" style={{marginTop:8}}>Dashboard warning light needs confirmation.</Text><Text muted style={{marginTop:5}}>Highest-impact open item in the current evidence set.</Text></Surface>
<SectionHeader title="2 · Price"/><Surface><Text variant="display">$19.4K</Text><Text muted style={{marginTop:4}}>Illustrative target based on market context and repair estimates.</Text></Surface>
<SectionHeader title="3 · Evidence"/><Surface><EvidenceCount/><Text muted style={{marginTop:5}}>Multiple media types are attached to the inspection.</Text></Surface>
<View style={{marginTop:15}}><Button title="Open full report" onPress={()=>onNavigate?.('report')}/></View>

  </Screen>;
}

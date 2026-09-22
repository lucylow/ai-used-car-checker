import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function MarketInsightV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Market insight" eyebrow="MARKET INTELLIGENCE" subtitle="Translate listings into a quick, evidence-aware market read." onBack={onBack}/>

<View style={{flexDirection:'row',gap:9}}><GlassStat label="Market" value="$21.1K" detail="current estimate" tone={COLORS.mint}/><GlassStat label="Ask" value="$21.9K" detail="+$800" tone={COLORS.amber}/></View>
<SectionHeader title="Market shape"/><Surface><MiniChart values={MARKET_POINTS}/><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:9}}><Text variant="caption" muted>Lower</Text><Text variant="caption" color={COLORS.mint}>Fair zone</Text><Text variant="caption" muted>Higher</Text></View></Surface>
<SectionHeader title="Evidence signals"/>{[['Mileage','Within local cluster','success'],['Condition','Needs repair budget','watch'],['Demand','Stable in local set','info']].map(([a,b,t])=><ActionRow key={a} icon="analytics-outline" title={a} subtitle={b} tone={t==='success'?COLORS.mint:t==='watch'?COLORS.amber:COLORS.cyan}/>) }
<SectionHeader title="Next"/><Button title="Open comparables" onPress={()=>onNavigate?.('marketplace')}/>

  </Screen>;
}

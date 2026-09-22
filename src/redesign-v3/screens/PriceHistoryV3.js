import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function PriceHistoryV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Price history" eyebrow="MARKET" subtitle="Visualize how the market has moved instead of hiding it in a table." onBack={onBack}/>

<Surface><Text variant="caption" muted>Indexed local asking prices</Text><Text variant="display" style={{marginTop:4}}>+2.4%</Text><Badge label="30 DAY CHANGE" tone="success"/><View style={{marginTop:16}}><MiniChart values={MARKET_POINTS} tone={COLORS.mint}/></View></Surface>
<SectionHeader title="What moved"/>{[['Comparable median','$21,100','+2.4%'],['Your asking','$21,900','+0.0%'],['Repair-adjusted target','$19,400','illustrative']].map(([l,v,c])=><View key={l} style={{paddingVertical:12,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="bodyStrong">{l}</Text><Text variant="caption" muted style={{marginTop:3}}>{c}</Text></View><Text variant="h3">{v}</Text></View>)}
<SectionHeader title="Context"/><Surface><Text muted>Market movement is informational; a comparable set, vehicle condition and timing can change the practical range.</Text></Surface>

  </Screen>;
}

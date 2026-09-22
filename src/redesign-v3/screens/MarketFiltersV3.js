import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function MarketFiltersV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Market filters" eyebrow="MARKET" subtitle="Shape the comparable set without leaving the vehicle context." onBack={onBack}/>

<Surface><Text variant="h2">Compare apples to apples</Text><Text muted style={{marginTop:5}}>Tighter filters make the market range easier to interpret.</Text></Surface>
<SectionHeader title="Vehicle"/>
{['Same model','±1 year','±20,000 mi','Same metro'].map((x,i)=><ActionRow key={x} icon="options-outline" title={x} subtitle={i===0?'Required':'Applied'} tone={i===0?COLORS.cyan:COLORS.mint}/>) }
<SectionHeader title="Seller type"/><View style={{flexDirection:'row',gap:8}}>{['All','Dealer','Private'].map((x,i)=><View key={x} onTouchEnd={()=>setSelected(x)} style={{flex:1,padding:12,borderRadius:99,borderWidth:1,borderColor:selected===x?COLORS.cyan:COLORS.line,backgroundColor:selected===x?'rgba(0,212,255,.1)':COLORS.surface,alignItems:'center'}}><Text variant="caption" color={selected===x?COLORS.cyan:COLORS.muted}>{x}</Text></View>)}</View>
<SectionHeader title="Apply"/><Button title="Apply market filters" onPress={()=>onNavigate?.('market')}/>

  </Screen>;
}

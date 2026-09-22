import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function OfferBuilderV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Offer builder" eyebrow="NEGOTIATION" subtitle="Assemble an offer from market context and inspection evidence." onBack={onBack}/>

<LargeMetric label="Target offer" value="$19,400" sub="Illustrative · review evidence" tone={COLORS.cyan}/>
<SectionHeader title="Price inputs"/>{[['Market estimate','$21,100'],['Condition budget','-$1,700'],['Seller asking','$21,900'],['Target offer','$19,400']].map(([l,v],i)=><InfoRow key={l} label={l} value={v} tone={i===3?COLORS.cyan:COLORS.white}/>) }
<SectionHeader title="Evidence attached"/><EvidenceCount photos={18} videos={2} docs={3}/>
<View style={{marginTop:12}}>{['Front bumper repair','Front tire wear','Dashboard warning'].map((x,i)=><View key={x} style={{paddingVertical:9,flexDirection:'row',alignItems:'center',gap:9}}><IssueBadge severity={i===2?'critical':'watch'}/><Text variant="bodyStrong" style={{flex:1}}>{x}</Text><Text variant="caption" color={COLORS.cyan}>Add</Text></View>)}</View>
<View style={{marginTop:15}}><Button title="Build negotiation brief" onPress={()=>onNavigate?.('negotiation')}/></View>

  </Screen>;
}

import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function SellerQuestionsV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Seller questions" eyebrow="NEGOTIATION" subtitle="Turn inspection findings into respectful, specific questions." onBack={onBack}/>

<Surface><Badge label="EVIDENCE-LINKED" tone="info"/><Text variant="h2" style={{marginTop:9}}>Questions worth asking</Text><Text muted style={{marginTop:4}}>Keep every question tied to something observable.</Text></Surface>
{[['Dashboard warning','Has this warning light been diagnosed or repaired before?'],['Front bumper','Has this area been repaired, painted or replaced?'],['Service records','Can I see service invoices for recent maintenance?'],['Tires','When were the front tires last replaced?']].map(([a,b])=><Surface key={a} style={{marginTop:9}}><Text variant="caption" color={COLORS.cyan}>{a}</Text><Text variant="h3" style={{marginTop:5}}>{b}</Text><View style={{marginTop:10}}><Badge label="Linked evidence" tone="info"/></View></Surface>)}
<View style={{marginTop:15}}><Button title="Copy questions" variant="outline" onPress={()=>{}}/></View>

  </Screen>;
}

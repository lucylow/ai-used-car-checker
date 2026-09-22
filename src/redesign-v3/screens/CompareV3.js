import React,{useState} from 'react';
import {View} from 'react-native';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface';
import Button from '../components/Button';
import Text from '../components/Text';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,CHECKLIST,COMPARABLES,REPAIRS,TIMELINE,MARKET_POINTS} from '../data/demoData';
import VehicleHero from '../components/VehicleHero';
import RiskRing from '../components/RiskRing';
import AIInsight from '../components/AIInsight';
import AITrustBanner from '../components/AITrustBanner';
import PriceRange from '../components/PriceRange';
import ChecklistRow from '../components/ChecklistRow';
import MediaTile from '../components/MediaTile';
import MultimodalTray from '../components/MultimodalTray';
import DocumentEvidence from '../components/DocumentEvidence';
import ConfidenceBar from '../components/ConfidenceBar';
import InfoRow from '../components/InfoRow';
import VehicleMap from '../components/VehicleMap';
import InspectionTimeline from '../components/InspectionTimeline';
import CostBreakdown from '../components/CostBreakdown';
import RepairLine from '../components/RepairLine';
import NegotiationPoint from '../components/NegotiationPoint';
import CopilotInput from '../components/CopilotInput';
import CopilotMessage from '../components/CopilotMessage';
import EmptyState from '../components/EmptyState';
import {ScrollView} from 'react-native';

export default function CompareV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Compare vehicles" eyebrow="DECISION" subtitle="Make differences visible instead of scrolling through raw data." onBack={onBack}/>

    <SectionHeader title="Selected vehicles"/>
    <View style={{flexDirection:'row',gap:8}}>{[DEMO_VEHICLE,{...DEMO_VEHICLE,year:2021,model:'Accord Touring',askingPrice:22900,risk:44,marketValue:22400}].map((v,i)=><View key={i} style={{flex:1}}><Surface><Text variant="h3" numberOfLines={2}>{v.year} {v.model}</Text><Text variant="display" style={{fontSize:28,marginTop:10}}>${v.askingPrice.toLocaleString()}</Text><Badge label={`${v.risk}/100`} tone={v.risk>70?'danger':v.risk>50?'watch':'success'}/></Surface></View>)}</View>
    <SectionHeader title="Side-by-side"/>{[['Market value','$21,100','$22,400'],['Mileage','42,180 mi','31,900 mi'],['Repairs','$980–$2,570','$400–$900'],['Evidence','18 items','14 items'],['Risk','68','44']].map(([l,a,b])=><View key={l} style={{paddingVertical:12,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row'}}><Text variant="caption" muted style={{width:'34%'}}>{l}</Text><Text variant="bodyStrong" style={{flex:1}}>{a}</Text><Text variant="bodyStrong" style={{flex:1,color:COLORS.mint}}>{b}</Text></View>)}
    <SectionHeader title="What changed?"/><Surface><AITrustBanner/><Text style={{marginTop:11}}>Vehicle 2 has lower observed risk and fewer estimated repairs, while Vehicle 1 has more evidence captured. Use the underlying findings to verify each difference.</Text></Surface>

  </Screen>;
}

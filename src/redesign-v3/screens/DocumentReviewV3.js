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

export default function DocumentReviewV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Review document" eyebrow="DOCUMENT AI" subtitle="Inspect extracted fields and uncertainty before they enter the report." onBack={onBack}/>

    <DocumentEvidence title="Seller inspection.jpg" type="IMAGE" verified={false} confidence={.71}/>
    <SectionHeader title="Extracted fields"/>{[['VIN','1HGCV2F34LA000000','.98',COLORS.mint],['Mileage','42,180 mi','.91',COLORS.mint],['Service date','Not detected','.41',COLORS.amber],['Seller name','Needs review','.52',COLORS.amber]].map(([l,v,c,t])=><View key={l} style={{paddingVertical:11,borderBottomWidth:1,borderBottomColor:COLORS.line}}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text variant="bodyStrong">{l}</Text><Text variant="caption" color={t}>{Math.round(Number(c)*100)}%</Text></View><Text variant="caption" muted style={{marginTop:3}}>{v}</Text></View>)}
    <AITrustBanner/>
    <View style={{marginTop:14}}><Button title="Confirm fields" onPress={()=>onNavigate?.('report')}/></View>

  </Screen>;
}

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

export default function TestDriveV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Test drive" eyebrow="TEST DRIVE" subtitle="Capture observations while the vehicle is moving." onBack={onBack}/>

    <Surface><Badge label="LIVE SESSION" tone="info"/><Text variant="h2" style={{marginTop:10}}>Drive observations</Text><Text muted style={{marginTop:4}}>Large controls keep the workflow simple while you collect notes.</Text></Surface>
    {['Steering','Braking','Acceleration','Transmission','Road noise'].map((x,i)=><View key={x} style={{marginTop:10}}><Surface><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text variant="bodyStrong">{x}</Text><Text variant="h3" color={i===0?COLORS.amber:COLORS.mint}>{[7.4,8.2,8.8,8.0,7.1][i].toFixed(1)}</Text></View><View style={{height:7,backgroundColor:COLORS.surface2,borderRadius:99,marginTop:10}}><View style={{width:`${[74,82,88,80,71][i]}%`,height:'100%',backgroundColor:i===0?COLORS.amber:COLORS.mint,borderRadius:99}}/></View><Text variant="caption" color={i===0?COLORS.amber:COLORS.mint} style={{marginTop:6}}>{i===0?'Watch':'Good'}</Text></Surface></View>)}
    <SectionHeader title="Voice observation"/><Surface><Text muted>“Steering feels slightly heavy on left turn.”</Text><View style={{marginTop:11,flexDirection:'row',gap:8}}>{[...Array(18)].map((_,i)=><View key={i} style={{flex:1,height:10+(i%5)*5,borderRadius:99,backgroundColor:COLORS.cyan,opacity:.5}}/>)}</View></Surface>
    <View style={{marginTop:18}}><Button title="Finish test drive" onPress={()=>onNavigate?.('costs')}/></View>

  </Screen>;
}

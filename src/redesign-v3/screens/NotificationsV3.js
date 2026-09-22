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

export default function NotificationsV3({onBack,onNavigate}){
  const [tab,setTab]=useState('Overview');
  const [open,setOpen]=useState(false);
  return <Screen>
    <ScreenHeader title="Notifications" eyebrow="UPDATES" subtitle="Only show events that can change what the user should do next." onBack={onBack}/>

    {[['Inspection ready','AI analysis is ready to review.','sparkles','info'],['Evidence requested','A clearer dashboard photo could improve confidence.','camera','watch'],['Market movement','Similar listings moved $300 lower in your area.','trending-down','success'],['Contract waiting','Your draft agreement is ready for human review.','document-text','info']].map(([t,d,i,tone])=><Surface key={t} style={{marginBottom:9}}><View style={{flexDirection:'row',gap:11}}><Badge label="NEW" tone={tone}/><View style={{flex:1}}><Text variant="bodyStrong">{t}</Text><Text muted style={{marginTop:4}}>{d}</Text></View><Text variant="caption" muted>›</Text></View></Surface>)}
    <View style={{marginTop:9}}><Button title="Mark all as read" variant="outline" onPress={()=>{}}/></View>

  </Screen>;
}

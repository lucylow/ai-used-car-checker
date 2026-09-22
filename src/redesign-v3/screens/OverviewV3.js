import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader'; import Surface from '../components/Surface';
import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge'; import MetricTile from '../components/MetricTile'; import GlassStat from '../components/GlassStat';
import ActionRow from '../components/ActionRow'; import LargeMetric from '../components/LargeMetric'; import EvidenceCount from '../components/EvidenceCount'; import EvidenceStack from '../components/EvidenceStack'; import EvidenceSource from '../components/EvidenceSource';
import EvidenceActions from '../components/EvidenceActions'; import CaptureModeCard from '../components/CaptureModeCard'; import PhotoPlaceholder from '../components/PhotoPlaceholder'; import ConfidencePill from '../components/ConfidencePill'; import AIReasoning from '../components/AIReasoning'; import AITrustBanner from '../components/AITrustBanner';
import SafetyWarning from '../components/SafetyWarning'; import Field from '../components/Field'; import TextArea from '../components/TextArea'; import ChoiceCard from '../components/ChoiceCard'; import ChoiceList from '../components/ChoiceList';
import PriceWaterfall from '../components/PriceWaterfall'; import MarketDeltaCard from '../components/MarketDeltaCard'; import ComparableCard from '../components/ComparableCard'; import ReportCover from '../components/ReportCover'; import ReportMetric from '../components/ReportMetric';
import CertificateHeader from '../components/CertificateHeader'; import SignatureBox from '../components/SignatureBox'; import ContractSummary from '../components/ContractSummary'; import SubscriptionOffer from '../components/SubscriptionOffer'; import RestorePurchasesRow from '../components/RestorePurchasesRow';
import NotificationCard from '../components/NotificationCard'; import SettingGroup from '../components/SettingGroup'; import SettingToggle from '../components/SettingToggle'; import OnboardingHero from '../components/OnboardingHero'; import AppStoreBadge from '../components/AppStoreBadge'; import SupportCard from '../components/SupportCard';
import VehicleHero from '../components/VehicleHero'; import RiskRing from '../components/RiskRing'; import AIInsight from '../components/AIInsight'; import ChecklistRow from '../components/ChecklistRow'; import InfoRow from '../components/InfoRow'; import MultimodalTray from '../components/MultimodalTray';
import {COLORS,RADIUS} from '../tokens'; import {DEMO_VEHICLE,FINDINGS,REPAIRS,COMPARABLES} from '../data/demoData';

export default function OverviewV3({onBack,onNavigate}){
 const [active,setActive]=useState('Overview');
 return <Screen><ScreenHeader title="Inspection command center" eyebrow="COMMAND CENTER" subtitle="A cinematic overview that prioritizes what matters now." onBack={onBack}/>

<VehicleHero vehicle={DEMO_VEHICLE}/>
<SectionHeader title="Decision signals"/>
<View style={{flexDirection:'row',gap:8}}><MetricTile label="Risk" value="68" detail="Moderate" tone={COLORS.amber}/><MetricTile label="Market" value="$21.1K" detail="estimate" tone={COLORS.mint}/><MetricTile label="Repairs" value="$980+" detail="estimate" tone={COLORS.amber}/></View>
<SectionHeader title="Next best action"/><Surface><Badge label="RECOMMENDED" tone="info"/><Text variant="h2" style={{marginTop:8}}>Verify the dashboard warning</Text><Text muted style={{marginTop:4}}>A clearer image or professional confirmation can reduce uncertainty.</Text><View style={{marginTop:12}}><Button title="Review evidence" onPress={()=>onNavigate?.('evidence')}/></View></Surface>
<SectionHeader title="Evidence density"/><EvidenceCount/><View style={{marginTop:10}}><EvidenceStack title="Dashboard warning" count={3}/></View>

</Screen>;
}

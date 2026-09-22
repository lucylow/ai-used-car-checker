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

export default function PaintScanV3({onBack,onNavigate}){
 const [active,setActive]=useState('Overview');
 return <Screen><ScreenHeader title="Paint scan" eyebrow="AI VISION" subtitle="Turn paint photos into a structured, visual review." onBack={onBack}/>

<Surface><Badge label="PHOTO ANALYSIS" tone="info"/><Text variant="h2" style={{marginTop:9}}>Paint condition</Text><Text muted style={{marginTop:4}}>Review scratches, visible variance and confidence without presenting them as definitive mechanical facts.</Text><View style={{marginTop:14,height:170,borderRadius:RADIUS.lg,backgroundColor:'#06101A',alignItems:'center',justifyContent:'center'}}><Text variant="display" color={COLORS.cyan}>AI SCAN</Text></View></Surface>
<SectionHeader title="Detected signals"/><View style={{flexDirection:'row',gap:8}}><MetricTile label="Scratches" value="3" detail="visible" tone={COLORS.amber}/><MetricTile label="Rust" value="0" detail="detected" tone={COLORS.mint}/></View>
<SectionHeader title="Confidence"/><ConfidencePill value={.86}/><View style={{marginTop:10}}><AIReasoning steps={['Front exterior photo','Rear quarter photo','Image quality check']}/></View>
<SectionHeader title="Safety"/><SafetyWarning/>

</Screen>;
}

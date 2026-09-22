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

export default function CameraCoachV3({onBack,onNavigate}){
 const [active,setActive]=useState('Overview');
 return <Screen><ScreenHeader title="Camera coach" eyebrow="CAPTURE" subtitle="Coach the user toward images that are useful to AI and humans." onBack={onBack}/>

<Surface><OnboardingHero step="CAPTURE / 01" title="Frame the damage" description="Keep the whole panel visible, then move closer for detail."/></Surface>
<SectionHeader title="Live guidance"/><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{['Good light','Low glare','Center object','Enough context'].map(x=><Badge key={x} label={x} tone="success"/>)}</View>
<SectionHeader title="Capture modes"/><View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><CaptureModeCard icon="camera" title="Photo" subtitle="Still evidence" onPress={()=>onNavigate?.('camera')}/></View><View style={{flex:1}}><CaptureModeCard icon="videocam" title="Video" subtitle="Motion / sound context" onPress={()=>onNavigate?.('camera')}/></View></View>
<SectionHeader title="Before capture"/><PhotoPlaceholder label="Ready when you are" subtitle="Tap to open the camera" onPress={()=>onNavigate?.('camera')}/>

</Screen>;
}

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

export default function ErrorMarketV3({onBack,onNavigate}){
 const [active,setActive]=useState('Overview');
 return <Screen><ScreenHeader title="Market unavailable" eyebrow="RECOVERY" subtitle="Keep the inspection usable when a live market request fails." onBack={onBack}/>

<Surface style={{backgroundColor:'rgba(244,183,64,.06)',borderColor:'rgba(244,183,64,.2)'}}><Badge label="LIVE DATA UNAVAILABLE" tone="watch"/><Text variant="h2" style={{marginTop:9}}>Your inspection is still safe.</Text><Text muted style={{marginTop:4}}>We could not refresh market data. Saved vehicle and inspection data are still available.</Text></Surface>
<SectionHeader title="What you can do"/>{[['Retry','Try the request again.'],['Continue inspection','Keep adding evidence.'],['Use saved estimate','Review previously cached context.']].map(([a,b],i)=><ActionRow key={a} icon={i===0?'refresh':'arrow-forward'} title={a} subtitle={b} onPress={()=>onNavigate?.(i===1?'checklist':'market')} tone={COLORS.cyan}/>) }

</Screen>;
}

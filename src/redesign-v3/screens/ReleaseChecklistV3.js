import React,{useState} from 'react';
import {View,ScrollView} from 'react-native';
import Screen from '../components/Screen'; import ScreenHeader from '../components/ScreenHeader'; import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface'; import Button from '../components/Button'; import Text from '../components/Text'; import Badge from '../components/Badge';
import LargeMetric from '../components/LargeMetric'; import GlassStat from '../components/GlassStat'; import ActionRow from '../components/ActionRow'; import EvidenceCount from '../components/EvidenceCount';
import PhotoPlaceholder from '../components/PhotoPlaceholder'; import MultimodalTray from '../components/MultimodalTray'; import ConfidencePill from '../components/ConfidencePill'; import IssueBadge from '../components/IssueBadge';
import MiniChart from '../components/MiniChart'; import TimelineStep from '../components/TimelineStep'; import InfoRow from '../components/InfoRow'; import {COLORS,RADIUS} from '../tokens';
import {DEMO_VEHICLE,FINDINGS,REPAIRS,TIMELINE,COMPARABLES,MARKET_POINTS} from '../data/demoData';

export default function ReleaseChecklistV3({onBack,onNavigate}){
  const [selected,setSelected]=useState('Overview');
  return <Screen><ScreenHeader title="Release checklist" eyebrow="SHIP" subtitle="A practical UI gate before sending the iOS build to review." onBack={onBack}/>

<Surface><Badge label="PRE-RELEASE" tone="info"/><Text variant="h2" style={{marginTop:9}}>Frontend release gate</Text><Text muted style={{marginTop:4}}>Use this screen as a visual QA checklist, not as an App Store approval guarantee.</Text></Surface>
<SectionHeader title="Interaction"/>{[['Touch targets','≥ 44pt'],['Back behavior','Predictable'],['Keyboard','Does not cover CTA'],['Dynamic Type','Layouts expand']].map(([l,v])=><ActionRow key={l} icon="checkmark-circle" title={l} subtitle={v} tone={COLORS.mint}/>) }
<SectionHeader title="Media"/>{[['Camera denied','Recovery path'],['Video unavailable','Fallback to photo'],['Large image','Progressive loading'],['Document missing','Retry without data loss']].map(([l,v])=><ActionRow key={l} icon="checkmark-circle" title={l} subtitle={v} tone={COLORS.mint}/>) }
<SectionHeader title="AI trust"/>{[['AI estimate labels','Visible'],['Confidence','Visible'],['Uncertainty','Explained'],['Human sign','Explicit']].map(([l,v])=><ActionRow key={l} icon="shield-checkmark" title={l} subtitle={v} tone={COLORS.mint}/>) }

  </Screen>;
}

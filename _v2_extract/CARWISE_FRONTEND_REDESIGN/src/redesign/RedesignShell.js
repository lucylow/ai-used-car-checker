import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import InspectionScreen from './screens/InspectionScreen';
import MediaScreen from './screens/MediaScreen';
import AIAnalysisScreen from './screens/AIAnalysisScreen';
import MarketScreen from './screens/MarketScreen';
import SummaryScreen from './screens/SummaryScreen';
import NegotiationScreen from './screens/NegotiationScreen';
import ReportScreen from './screens/ReportScreen';
import HistoryScreen from './screens/HistoryScreen';
import CertificateScreen from './screens/CertificateScreen';
import AssistantSheet from './screens/AssistantSheet';
import OnboardingScreen from './screens/OnboardingScreen';
import NewInspectionScreen from './screens/NewInspectionScreen';
import PaywallScreen from './screens/PaywallScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ContractScreen from './screens/ContractScreen';
import GarageScreen from './screens/GarageScreen';
import InspectionDetailScreen from './screens/InspectionDetailScreen';
import EvidenceReviewScreen from './screens/EvidenceReviewScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShareCenterScreen from './screens/ShareCenterScreen';
import DemoModeScreen from './screens/DemoModeScreen';
import DesignSystemScreen from './screens/DesignSystemScreen';
import VisualStatesScreen from './screens/VisualStatesScreen';
import PresentationShowcaseScreen from './screens/PresentationShowcaseScreen';
import CameraStudioScreen from './screens/CameraStudioScreen';
import ReportComposerScreen from './screens/ReportComposerScreen';
import { CostScreen, TestDriveScreen, MaintenanceScreen, VehicleHistoryScreen, VinScreen, CompareScreen, SettingsScreen } from './screens/ToolsScreens';
import { BottomNavigation } from './components/Navigation';
import { buildRedesignData, resolveRedesignRoute } from './adapters';

export default function RedesignShell({ screen = 'home', state = {}, actions = {}, showNavigation = true }) {
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const data = useMemo(() => buildRedesignData(state), [state]);
  const route = resolveRedesignRoute(screen);
  const nav = { ...actions, onOpenCopilot: () => setAssistantVisible(true), onNotifications: actions.onNotifications || (() => actions.onOpenSettings?.()) };
  const setTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') actions.onNavigate?.('home');
    if (tab === 'inspect') actions.onNavigate?.('checklist');
    if (tab === 'reports') actions.onNavigate?.('report');
    if (tab === 'history') actions.onNavigate?.('history');
    if (tab === 'profile') actions.onNavigate?.('settings');
  };

  const current = (() => {
    switch (route) {
      case 'onboarding': return <OnboardingScreen data={data} actions={nav} />;
      case 'new': return <NewInspectionScreen data={data} actions={nav} />;
      case 'inspection': return <InspectionScreen data={data} actions={nav} />;
      case 'media': return <MediaScreen data={data} actions={nav} />;
      case 'ai': return <AIAnalysisScreen data={data} actions={nav} />;
      case 'market': return <MarketScreen data={data} actions={nav} />;
      case 'summary': return <SummaryScreen data={data} actions={nav} />;
      case 'negotiation': return <NegotiationScreen data={data} actions={nav} />;
      case 'report': return <ReportScreen data={data} actions={nav} />;
      case 'history': return <HistoryScreen data={data} actions={nav} />;
      case 'certificate': return <CertificateScreen data={data} actions={nav} />;
      case 'vin': return <VinScreen data={data} actions={nav} />;
      case 'cost': return <CostScreen data={data} actions={nav} />;
      case 'test': return <TestDriveScreen data={data} actions={nav} />;
      case 'maintenance': return <MaintenanceScreen data={data} actions={nav} />;
      case 'vehicle-history': return <VehicleHistoryScreen data={data} actions={nav} />;
      case 'compare': return <CompareScreen data={data} actions={nav} />;
      case 'settings': return <SettingsScreen data={data} actions={nav} />;
      case 'paywall': return <PaywallScreen data={data} actions={nav} />;
      case 'notifications': return <NotificationsScreen data={data} actions={nav} />;
      case 'contract': return <ContractScreen data={data} actions={nav} />;
      case 'garage': return <GarageScreen data={data} actions={nav} />;
      case 'inspection-detail': return <InspectionDetailScreen data={data} actions={nav} />;
      case 'evidence-review': return <EvidenceReviewScreen data={data} actions={nav} />;
      case 'market-explorer': return <MarketplaceScreen data={data} actions={nav} />;
      case 'profile': return <ProfileScreen data={data} actions={nav} />;
      case 'share': return <ShareCenterScreen data={data} actions={nav} />;
      case 'demo': return <DemoModeScreen data={data} actions={nav} />;
      case 'design-system': return <DesignSystemScreen data={data} actions={nav} />;
      case 'visual-states': return <VisualStatesScreen data={data} actions={nav} />;
      case 'showcase': return <PresentationShowcaseScreen data={data} actions={nav} />;
      case 'camera-studio': return <CameraStudioScreen data={data} actions={nav} />;
      case 'report-composer': return <ReportComposerScreen data={data} actions={nav} />;
      default: return <HomeScreen data={data} actions={nav} />;
    }
  })();

  return <View style={{ flex: 1 }}>
    {current}
    {showNavigation ? <BottomNavigation active={route === 'inspection' || route === 'media' || route === 'ai' ? 'inspect' : route === 'report' ? 'reports' : route === 'history' ? 'history' : route === 'settings' ? 'profile' : activeTab} onChange={setTab} /> : null}
    <AssistantSheet visible={assistantVisible} onClose={() => setAssistantVisible(false)} data={data} actions={nav} />
  </View>;
}

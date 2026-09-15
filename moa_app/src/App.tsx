import { useState } from 'react';
import { LANGUAGES } from './data/languages';
import { getTranslation } from './data/translations';
import {
  MOCK_INSPECTOR,
  MOCK_LOT_SCANS,
  MOCK_GRADING_RULES,
  MOCK_AUDIT_LOGS,
  MOCK_SYNC_QUEUE,
  MOCK_NOTIFICATIONS,
  MOCK_DETECTED_ONIONS,
} from './data/mockData';
import realModelDetections from './data/realModelDetections.json';
import { detectOnionsDynamically, type DynamicDetectionResult } from './utils/onionVisionDetector';
import type {
  Language,
  InspectorProfile,
  LotScan,
  GradingRules,
  AuditLogEntry,
  SyncQueueItem,
  NotificationItem,
  DetectedOnion,
  OnionCondition,
} from './types';

// Components
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LandingScreen } from './components/LandingScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { NewScanScreen } from './components/NewScanScreen';
import { LiveDetectionScreen } from './components/LiveDetectionScreen';
import { ClassificationResultsScreen } from './components/ClassificationResultsScreen';
import { GradingSummaryScreen } from './components/GradingSummaryScreen';
import { ManualOverrideScreen } from './components/ManualOverrideScreen';
import { GradingRulesScreen } from './components/GradingRulesScreen';
import { AuditTrailScreen } from './components/AuditTrailScreen';
import { ReportsView } from './components/ReportsView';
import { SyncQueueScreen } from './components/SyncQueueScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { HelpSupportScreen } from './components/HelpSupportScreen';
import { NotificationsScreen } from './components/NotificationsScreen';

import './styles/theme.css';

export function App() {
  // 1. Mandatory Initial Stage: 'landing' -> 'language_selection' -> 'onboarding' -> 'auth' -> 'main_app'
  const [screenStage, setScreenStage] = useState<'landing' | 'language_selection' | 'onboarding' | 'auth' | 'main_app'>('landing');

  // Selected Language (Default English)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Authenticated Inspector Profile
  const [profile, setProfile] = useState<InspectorProfile>(MOCK_INSPECTOR);

  // Active Tab state ('home' | 'scan' | 'live_detection' | 'classification' | 'summary' | 'audit' | 'rules' | 'reports' | 'sync' | 'sop' | 'profile' | 'notifications')
  const [activeTab, setActiveTab] = useState<string>('home');

  // Active Lot Scan & Image state
  const [scans, setScans] = useState<LotScan[]>(MOCK_LOT_SCANS);
  const [activeLotScan, setActiveLotScan] = useState<LotScan>(MOCK_LOT_SCANS[0]);
  const [detectedItems, setDetectedItems] = useState<DetectedOnion[]>(MOCK_DETECTED_ONIONS);
  const [customScanImage, setCustomScanImage] = useState<string | null>(null);

  // Grading Rules config
  const [rules, setRules] = useState<GradingRules>(MOCK_GRADING_RULES);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);

  // Sync Queue
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(MOCK_SYNC_QUEUE);

  // Notifications
  const [notifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Override Modal state
  const [overrideOnion, setOverrideOnion] = useState<DetectedOnion | null>(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  // View Simulator Toggle
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  // Current translated strings for UI
  const labels = getTranslation(selectedLanguage.id);

  // Handlers for Screen Progression
  const handleConfirmLanguage = () => {
    setScreenStage('onboarding');
  };

  const handleFinishOnboarding = () => {
    setScreenStage('auth');
  };

  const handleLoginSuccess = (updatedProfile: InspectorProfile) => {
    setProfile(updatedProfile);
    setScreenStage('main_app');
  };

  const handleLogout = () => {
    setScreenStage('auth');
  };

// Start New Scan Handler with real ML model detections
  const handleStartNewScanMode = async (
    mode: 'single' | 'batch_tray' | 'full_crate' | 'auto',
    selectedImage?: string,
    dynamicResult?: DynamicDetectionResult
  ) => {
    let chosenImage = selectedImage;
    if (!chosenImage) {
      if (mode === 'single') chosenImage = '/mode-single.jpg';
      else if (mode === 'batch_tray') chosenImage = '/mode-batch.jpg';
      else chosenImage = '/user-dense-crate.jpg';
    }
    setCustomScanImage(chosenImage);
    const newLotNumber = `LOT-2025-MH-0${Math.floor(10000 + Math.random() * 90000)}`;

    let generatedItems: DetectedOnion[] = [];
    let gradeA = 0;
    let damaged = 0;
    let rotten = 0;
    let sprouted = 0;
    let undersized = 0;
    let gradeAPct = 100.0;
    let ursCount = 0;
    let ursPct = 0.0;
    let total = 0;

    // 1. Run dynamic detection to segment individual onions and generate annotated yellow square snapshot
    let dynResult = dynamicResult;
    if (!dynResult) {
      try {
        dynResult = await detectOnionsDynamically(chosenImage);
      } catch (err) {
        console.warn('Dynamic vision detection fallback:', err);
      }
    }

    if (dynResult && dynResult.items.length > 0) {
      generatedItems = dynResult.items;
      total = dynResult.totalDetected;
      gradeA = dynResult.gradeACount;
      damaged = dynResult.damagedCount;
      rotten = dynResult.rottenCount;
      sprouted = dynResult.sproutedCount;
      undersized = dynResult.undersizedCount;
      gradeAPct = dynResult.gradeAPercentage;
      ursCount = rotten + sprouted + undersized;
      ursPct = dynResult.ursPercentage;
    } else {
      let effectiveMode = mode;
      if (chosenImage === '/mode-single.jpg' || mode === 'single') {
        effectiveMode = 'single';
      }
      const modelData = (realModelDetections as any)[effectiveMode] || (realModelDetections as any)['single'];
      const rawItems = modelData?.items || [];
      generatedItems = rawItems.map((item: any, idx: number) => {
        const condition: OnionCondition = item.class as OnionCondition;
        return {
          id: `on-real-${Date.now()}-${item.id || idx + 1}`,
          onionIndex: item.id || idx + 1,
          condition,
          confidence: item.confidence || 98,
          diameterMm: item.diameterMm || 45,
          weightGrams: Math.round(50 + (item.diameterMm || 45) * 1.5),
          bbox: {
            x: item.bbox.x,
            y: item.bbox.y,
            width: item.bbox.width,
            height: item.bbox.height,
          },
          maskColor: 'rgba(250, 204, 21, 0.25)',
          defectDetails: condition === 'grade_a' ? undefined : `${condition.toUpperCase()} defect verified by MobileNetV3`,
        };
      });

      gradeA = generatedItems.filter((i) => i.condition === 'grade_a').length;
      damaged = generatedItems.filter((i) => i.condition === 'damaged').length;
      rotten = generatedItems.filter((i) => i.condition === 'rotten').length;
      sprouted = generatedItems.filter((i) => i.condition === 'sprouted').length;
      undersized = generatedItems.filter((i) => i.condition === 'undersized').length;
      total = generatedItems.length;

      gradeAPct = total > 0 ? Number(((gradeA / total) * 100).toFixed(1)) : 100.0;
      ursCount = rotten + sprouted + undersized;
      ursPct = total > 0 ? Number(((ursCount / total) * 100).toFixed(1)) : 0.0;
    }

    const annotatedSnapshot = dynResult?.annotatedImageUrl || (chosenImage === '/mode-single.jpg' ? '/official_quality_report_single_annotated.jpg' : chosenImage);

    const newLot: LotScan = {
      id: `lot-${Date.now()}`,
      lotNumber: newLotNumber,
      procurementCenter: profile.centerName,
      centerId: profile.centerId,
      inspectorId: profile.inspectorId,
      inspectorName: profile.name,
      timestamp: new Date().toLocaleString(),
      scanMode: total === 1 ? 'single' : (mode as any),
      totalOnions: total,
      gradeACount: gradeA,
      gradeAPercentage: gradeAPct,
      ursCount: ursCount,
      ursPercentage: ursPct,
      defectBreakdown: {
        gradeA,
        damaged,
        rotten,
        sprouted,
        undersized,
      },
      items: generatedItems,
      overallGrade: gradeAPct >= 75 ? 'GRADE A ACCEPTED' : 'REJECTED - HIGH DEFECT',
      syncStatus: 'pending_sync',
      isFinalized: false,
      hasOverrides: false,
      imageUrl: chosenImage,
      annotatedImageUrl: annotatedSnapshot,
    };
    setActiveLotScan(newLot);
    setScans((prev) => [newLot, ...prev]);
    setDetectedItems(generatedItems);
    setActiveTab('live_detection');
  };

  // Handle Manual Override
  const handleSaveOverride = (onionId: string, newCondition: OnionCondition, reason: string) => {
    const updatedItems = detectedItems.map((item) => {
      if (item.id === onionId) {
        return {
          ...item,
          originalCondition: item.isOverridden ? item.originalCondition : item.condition,
          condition: newCondition,
          isOverridden: true,
          overrideReason: reason,
          overrideTimestamp: new Date().toLocaleString(),
          overrideInspectorId: profile.inspectorId,
        };
      }
      return item;
    });

    setDetectedItems(updatedItems);

    const gradeA = updatedItems.filter((i) => i.condition === 'grade_a').length;
    const damaged = updatedItems.filter((i) => i.condition === 'damaged').length;
    const rotten = updatedItems.filter((i) => i.condition === 'rotten').length;
    const sprouted = updatedItems.filter((i) => i.condition === 'sprouted').length;
    const undersized = updatedItems.filter((i) => i.condition === 'undersized').length;
    const total = updatedItems.length;

    const gradeAPct = Number(((gradeA / total) * 100).toFixed(1));
    const ursCount = rotten + sprouted + undersized;
    const ursPct = Number(((ursCount / total) * 100).toFixed(1));

    const isPass = gradeAPct >= rules.gradeAMinPercentage && ursPct <= rules.ursMaxPercentage;

    const updatedLot: LotScan = {
      ...activeLotScan,
      totalOnions: total,
      gradeACount: gradeA,
      gradeAPercentage: gradeAPct,
      ursCount: ursCount,
      ursPercentage: ursPct,
      defectBreakdown: {
        gradeA,
        damaged,
        rotten,
        sprouted,
        undersized,
      },
      items: updatedItems,
      overallGrade: isPass ? 'GRADE A ACCEPTED' : 'REJECTED - HIGH DEFECT',
      hasOverrides: true,
    };

    setActiveLotScan(updatedLot);
    setScans([updatedLot, ...scans.filter((s) => s.id !== updatedLot.id)]);

    const newAuditLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      lotId: updatedLot.id,
      lotNumber: updatedLot.lotNumber,
      timestamp: new Date().toLocaleString(),
      inspectorId: profile.inspectorId,
      inspectorName: profile.name,
      actionType: 'CLASSIFICATION_OVERRIDDEN',
      details: `Onion #${onionId} reclassified to "${newCondition.toUpperCase()}". Rationale: ${reason}`,
      previousValue: overrideOnion?.condition,
      newValue: newCondition,
      onionId: onionId,
    };

    setAuditLogs([newAuditLog, ...auditLogs]);

    const existingQueueItem = syncQueue.find((q) => q.lotId === updatedLot.id);
    if (existingQueueItem) {
      setSyncQueue(
        syncQueue.map((q) =>
          q.lotId === updatedLot.id ? { ...q, gradeAPercentage: gradeAPct, syncStatus: 'queued' } : q
        )
      );
    } else {
      setSyncQueue([
        {
          id: `sq-${Date.now()}`,
          lotId: updatedLot.id,
          lotNumber: updatedLot.lotNumber,
          timestamp: updatedLot.timestamp,
          totalOnions: total,
          gradeAPercentage: gradeAPct,
          syncStatus: 'queued',
          retryCount: 0,
          fileSizeBytes: 2480000,
        },
        ...syncQueue,
      ]);
    }
  };

  const handleSyncAllQueue = () => {
    setSyncQueue(
      syncQueue.map((q) => ({ ...q, syncStatus: 'synced' }))
    );
  };

  const pendingSyncCount = syncQueue.filter((q) => q.syncStatus === 'queued').length;

  // Render Screen Stage 0: Public Landing Page
  if (screenStage === 'landing') {
    return (
      <LandingScreen
        onGetStarted={() => setScreenStage('language_selection')}
      />
    );
  }

  // Render Screen Stage 1: Mandatory Language Selection Screen
  if (screenStage === 'language_selection') {
    return (
      <LanguageScreen
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        onConfirm={handleConfirmLanguage}
      />
    );
  }

  // Render Screen Stage 1: Onboarding Carousel
  if (screenStage === 'onboarding') {
    return (
      <OnboardingScreen
        labels={labels}
        onFinish={handleFinishOnboarding}
      />
    );
  }

  // Render Screen Stage 2: Inspector Login Screen
  if (screenStage === 'auth') {
    return (
      <AuthScreen
        labels={labels}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Render Screen Stage 3: Main Application Layout (Fixed Header & Nav, Scrollable Main Content)
  return (
    <div className="app-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'var(--bg-linen)',
      minHeight: '100vh',
    }}>
      {/* Outer Shell for Mobile Frame Simulation option */}
      <div style={{
        maxWidth: isMobileSimulator ? '460px' : '100%',
        width: '100%',
        minHeight: isMobileSimulator ? '880px' : '100vh',
        backgroundColor: 'transparent',
        borderRadius: isMobileSimulator ? 'var(--radius-lg)' : 0,
        boxShadow: isMobileSimulator ? 'var(--shadow-lg)' : 'none',
        border: isMobileSimulator ? '8px solid var(--text-earth-brown)' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header (Fixed) */}
        <Header
          currentLanguage={selectedLanguage}
          profile={profile}
          onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
          isMobileSimulator={isMobileSimulator}
          onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
          pendingSyncCount={pendingSyncCount}
        />

        {/* Navigation (Fixed) */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          labels={labels}
          isMobileSimulator={isMobileSimulator}
        />

        {/* Main Screen Content Body (Normal Page Scroll) */}
        <main style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '1.25rem 1rem 4rem 1rem',
        }}>
          {activeTab === 'home' && (
            <HomeDashboard
              profile={profile}
              recentScans={scans}
              rules={rules}
              labels={labels}
              onNavigateTab={setActiveTab}
              onStartNewScan={() => setActiveTab('scan')}
              pendingSyncCount={pendingSyncCount}
            />
          )}

          {activeTab === 'scan' && (
            <NewScanScreen
              labels={labels}
              onProceedToDetection={(mode, img, dynRes) => handleStartNewScanMode(mode, img, dynRes)}
            />
          )}

          {activeTab === 'live_detection' && (
            <LiveDetectionScreen
              items={detectedItems}
              labels={labels}
              imageUrl={activeLotScan?.imageUrl || customScanImage || '/user-dense-crate.jpg'}
              onProceedToClassification={() => setActiveTab('classification')}
            />
          )}

          {activeTab === 'classification' && (
            <ClassificationResultsScreen
              items={detectedItems}
              labels={labels}
              imageUrl={activeLotScan?.imageUrl || customScanImage || '/mode-single.jpg'}
              onOpenOverrideModal={(onion) => {
                setOverrideOnion(onion);
                setIsOverrideModalOpen(true);
              }}
              onProceedToSummary={() => setActiveTab('summary')}
            />
          )}

          {activeTab === 'summary' && (
            <GradingSummaryScreen
              scan={activeLotScan}
              rules={rules}
              labels={labels}
              onNavigateToReports={() => setActiveTab('reports')}
              onNavigateToAudit={() => setActiveTab('audit')}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTrailScreen
              logs={auditLogs}
              labels={labels}
            />
          )}

          {activeTab === 'rules' && (
            <GradingRulesScreen
              rules={rules}
              onUpdateRules={(newRules) => setRules(newRules)}
              labels={labels}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              labels={labels}
              profile={profile}
              latestScan={activeLotScan}
            />
          )}

          {activeTab === 'sync' && (
            <SyncQueueScreen
              queue={syncQueue}
              labels={labels}
              onSyncNow={handleSyncAllQueue}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              profile={profile}
              currentLanguage={selectedLanguage}
              labels={labels}
              onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'sop' && (
            <HelpSupportScreen labels={labels} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsScreen
              notifications={notifications}
              labels={labels}
              onNavigateToSync={() => setActiveTab('sync')}
            />
          )}
        </main>

        {/* Human-in-the-Loop Override Modal */}
        <ManualOverrideScreen
          onion={overrideOnion}
          isOpen={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          onSaveOverride={handleSaveOverride}
          labels={labels}
        />

        {/* In-App Language Switcher Modal */}
        {isLanguageModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(50, 38, 31, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            overflowY: 'auto',
          }}>
            <LanguageScreen
              selectedLanguage={selectedLanguage}
              onSelectLanguage={(lang) => setSelectedLanguage(lang)}
              onConfirm={() => setIsLanguageModalOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

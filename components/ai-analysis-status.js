import { Animated, Text } from 'react-native';

function AiAnalysisStatus({ busy, aiPulse, onRun, MotionButton, Card, styles, colors }) {
  if (!busy) return <Card style={styles.aiPrompt}><Text style={styles.aiGlyph}>✦</Text><Text style={styles.cardTitle}>Ready to scan this inspection?</Text><Text style={styles.muted}>We’ll surface likely issues, prioritize repairs, and estimate a fair price.</Text><MotionButton accessibilityLabel="Run AI analysis" style={styles.primaryButton} onPress={onRun}><Text style={styles.primaryButtonText}>Run analysis</Text><Text style={styles.buttonArrow}>→</Text></MotionButton></Card>;
  return <Card style={styles.aiPrompt} accessibilityLiveRegion="polite"><Text style={styles.aiGlyph}>✦</Text><Text style={styles.cardTitle}>AI is reviewing this inspection…</Text><Text style={styles.muted}>Checking vehicle details, checklist coverage, and photo evidence.</Text><Animated.View style={[styles.skeletonBlock, { opacity: aiPulse, backgroundColor: colors.surface }]} /><Animated.View style={[styles.skeletonBlock, { width: '72%', opacity: aiPulse, backgroundColor: colors.surface }]} /><Animated.View style={[styles.skeletonBlock, { width: '48%', opacity: aiPulse, backgroundColor: colors.surface }]} /><Text style={styles.muted}>This usually takes a moment. You can review the findings when processing finishes.</Text></Card>;
}

export default AiAnalysisStatus;

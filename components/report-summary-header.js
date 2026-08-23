import { Text, View } from 'react-native';

function ReportSummaryHeader({ vehicle, riskScore, issues, repairTotal, aiResult, checklistComplete, photos, reportReadiness, motionDuration, AnimatedCard, Card, Pill, formatCurrency, styles }) {
  return <>
    <AnimatedCard style={styles.scoreCard} animationKey={`${riskScore}-${issues.length}-${checklistComplete}`} duration={motionDuration}><Text style={styles.cardEyebrow}>OVERALL RISK</Text><Text style={styles.score}>{riskScore}</Text><Pill tone={riskScore >= 60 ? 'amber' : 'mint'}>{riskScore >= 60 ? 'REVIEW BEFORE BUYING' : 'LOWER RISK'}</Pill><Text style={styles.muted}>Calculated from issue severity, not a mechanical diagnosis.</Text></AnimatedCard>
    <View style={styles.metricRow}><Card style={styles.metric}><Text style={styles.metricValue}>{issues.length}</Text><Text style={styles.muted}>issues</Text></Card><Card style={styles.metric}><Text style={styles.metricValue}>{formatCurrency(repairTotal)}</Text><Text style={styles.muted}>repairs</Text></Card><Card style={styles.metric}><Text style={styles.metricValue}>{aiResult?.fairPrice ? formatCurrency(aiResult.fairPrice) : '—'}</Text><Text style={styles.muted}>AI fair price</Text></Card></View>
    <Card><Text style={styles.cardEyebrow}>REPORT READINESS</Text><Text style={reportReadiness.ready ? styles.readinessReady : styles.readinessPending}>{reportReadiness.ready ? 'Ready for a complete report' : 'Finish required sections before sharing'}</Text>{reportReadiness.missing.length ? <Text style={styles.muted}>Still needed: {reportReadiness.missing.join(' · ')}</Text> : <Text style={styles.muted}>Vehicle, checklist, and photo evidence are present.</Text>}</Card>
    <Card><Text style={styles.cardEyebrow}>INSPECTION DETAILS</Text><Text style={styles.detailRow}>Checklist progress: {checklistComplete}/5 sections</Text><Text style={styles.detailRow}>Photo evidence: {photos.length} item(s)</Text><Text style={styles.detailRow}>Critical issues: {issues.filter((issue) => issue.severity === 'critical').length}</Text></Card>
  </>;
}

export default ReportSummaryHeader;

import { Image, ScrollView, Text, TouchableOpacity, View, Animated } from 'react-native';
import { getInspectionNavigationLabel, getPhotoScreenGuidance } from '../src/services/reportUtils';

function PhotoEvidenceScreen({ photos, photoBusy, photoReviewFeedback, photoEvidenceReview, photoReviewFilter, onPhotoReviewFilterChange, onMarkPhotoReviewed, onAddPhotoFinding, onRemovePhoto, onTakePhoto, onChoosePhoto, onChecklist, Card, ActionButton, PhotoEvidenceReview, styles, colors }) {
  return <ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" accessibilityLabel={getInspectionNavigationLabel('checklist')} style={styles.back} onPress={onChecklist}>‹ Checklist</Text>
    <Text style={styles.pageTitle}>Inspection photos</Text>
    <Text style={styles.pageBody}>Capture reference slots for panels, tires, engine bay, and interior. AI analysis can use these later.</Text>
    <Text accessibilityLiveRegion="polite" style={styles.muted}>{getPhotoScreenGuidance(photos.length)}</Text>
    <Animated.View style={[styles.photoGrid, { opacity: photoReviewFeedback }]}>
      {photos.map((photo, index) => <View key={photo.id} style={styles.photoTile}>{photo.uri ? <Image source={{ uri: photo.uri }} style={styles.photoPreview} accessibilityLabel={`Inspection photo ${index + 1}`} /> : null}<Text style={styles.photoNumber}>PHOTO {index + 1}</Text>{photo.uri ? <Text style={styles.photoMark}>✓</Text> : <Text style={styles.photoMark}>◌</Text>}<TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove photo ${index + 1}`} onPress={() => onRemovePhoto(photo)}><Text style={styles.photoRemove}>Remove</Text></TouchableOpacity></View>)}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Take inspection photo" accessibilityHint="Opens the camera" accessibilityState={{ busy: photoBusy, disabled: photoBusy }} disabled={photoBusy} style={[styles.photoAdd, photoBusy && styles.reportActionDisabled]} onPress={onTakePhoto}><Text style={styles.photoAddPlus}>⌾</Text><Text style={styles.photoAddText}>{photoBusy ? 'Processing…' : 'Take photo'}</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose inspection photo" accessibilityHint="Opens the photo library" accessibilityState={{ busy: photoBusy, disabled: photoBusy }} disabled={photoBusy} style={[styles.photoAdd, photoBusy && styles.reportActionDisabled]} onPress={onChoosePhoto}><Text style={styles.photoAddPlus}>＋</Text><Text style={styles.photoAddText}>{photoBusy ? 'Processing…' : 'Choose photo'}</Text></TouchableOpacity>
    </Animated.View>
    {photoEvidenceReview.length ? <Animated.View style={{ opacity: photoReviewFeedback }}><PhotoEvidenceReview reviews={photoEvidenceReview} filter={photoReviewFilter} onFilterChange={onPhotoReviewFilterChange} onMarkReviewed={onMarkPhotoReviewed} onAddFinding={onAddPhotoFinding} styles={styles} colors={colors} /></Animated.View> : null}
    <ActionButton accessibilityLabel="Continue to AI analysis" label="Continue to AI analysis" onPress={onChecklist} />
  </ScrollView>;
}

export default PhotoEvidenceScreen;

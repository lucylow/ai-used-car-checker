import { Modal, View } from 'react-native';

function ReportPreviewModal({ visible, onClose, children, styles }) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><View style={styles.modalBackdrop}><View style={styles.modalCard}>{children}</View></View></Modal>;
}

export default ReportPreviewModal;

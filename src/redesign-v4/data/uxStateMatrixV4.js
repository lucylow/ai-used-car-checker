/** Full frontend state copy and interaction matrix for visual QA. */
export const UX_STATE_MATRIX = {
  Home: {
    default: {
      title: 'Home — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Home default ready.'
    },
    loading: {
      title: 'Home — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Home loading ready.'
    },
    empty: {
      title: 'Home — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Home empty ready.'
    },
    error: {
      title: 'Home — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Home error ready.'
    },
    offline: {
      title: 'Home — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Home offline ready.'
    },
    permission: {
      title: 'Home — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Home permission ready.'
    },
    partial: {
      title: 'Home — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Home partial ready.'
    },
    success: {
      title: 'Home — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Home success ready.'
    },
    locked: {
      title: 'Home — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Home locked ready.'
    },
    review: {
      title: 'Home — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Home review ready.'
    },
  },
  VIN: {
    default: {
      title: 'VIN — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VIN default ready.'
    },
    loading: {
      title: 'VIN — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VIN loading ready.'
    },
    empty: {
      title: 'VIN — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VIN empty ready.'
    },
    error: {
      title: 'VIN — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'VIN error ready.'
    },
    offline: {
      title: 'VIN — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VIN offline ready.'
    },
    permission: {
      title: 'VIN — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VIN permission ready.'
    },
    partial: {
      title: 'VIN — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VIN partial ready.'
    },
    success: {
      title: 'VIN — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'VIN success ready.'
    },
    locked: {
      title: 'VIN — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VIN locked ready.'
    },
    review: {
      title: 'VIN — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VIN review ready.'
    },
  },
  Market: {
    default: {
      title: 'Market — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Market default ready.'
    },
    loading: {
      title: 'Market — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Market loading ready.'
    },
    empty: {
      title: 'Market — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Market empty ready.'
    },
    error: {
      title: 'Market — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Market error ready.'
    },
    offline: {
      title: 'Market — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Market offline ready.'
    },
    permission: {
      title: 'Market — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Market permission ready.'
    },
    partial: {
      title: 'Market — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Market partial ready.'
    },
    success: {
      title: 'Market — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Market success ready.'
    },
    locked: {
      title: 'Market — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Market locked ready.'
    },
    review: {
      title: 'Market — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Market review ready.'
    },
  },
  PhotoCapture: {
    default: {
      title: 'PhotoCapture — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'PhotoCapture default ready.'
    },
    loading: {
      title: 'PhotoCapture — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'PhotoCapture loading ready.'
    },
    empty: {
      title: 'PhotoCapture — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'PhotoCapture empty ready.'
    },
    error: {
      title: 'PhotoCapture — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'PhotoCapture error ready.'
    },
    offline: {
      title: 'PhotoCapture — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'PhotoCapture offline ready.'
    },
    permission: {
      title: 'PhotoCapture — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'PhotoCapture permission ready.'
    },
    partial: {
      title: 'PhotoCapture — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'PhotoCapture partial ready.'
    },
    success: {
      title: 'PhotoCapture — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'PhotoCapture success ready.'
    },
    locked: {
      title: 'PhotoCapture — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'PhotoCapture locked ready.'
    },
    review: {
      title: 'PhotoCapture — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'PhotoCapture review ready.'
    },
  },
  VideoReview: {
    default: {
      title: 'VideoReview — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VideoReview default ready.'
    },
    loading: {
      title: 'VideoReview — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VideoReview loading ready.'
    },
    empty: {
      title: 'VideoReview — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VideoReview empty ready.'
    },
    error: {
      title: 'VideoReview — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'VideoReview error ready.'
    },
    offline: {
      title: 'VideoReview — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VideoReview offline ready.'
    },
    permission: {
      title: 'VideoReview — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VideoReview permission ready.'
    },
    partial: {
      title: 'VideoReview — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VideoReview partial ready.'
    },
    success: {
      title: 'VideoReview — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'VideoReview success ready.'
    },
    locked: {
      title: 'VideoReview — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VideoReview locked ready.'
    },
    review: {
      title: 'VideoReview — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VideoReview review ready.'
    },
  },
  VoiceReview: {
    default: {
      title: 'VoiceReview — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VoiceReview default ready.'
    },
    loading: {
      title: 'VoiceReview — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VoiceReview loading ready.'
    },
    empty: {
      title: 'VoiceReview — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VoiceReview empty ready.'
    },
    error: {
      title: 'VoiceReview — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'VoiceReview error ready.'
    },
    offline: {
      title: 'VoiceReview — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VoiceReview offline ready.'
    },
    permission: {
      title: 'VoiceReview — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VoiceReview permission ready.'
    },
    partial: {
      title: 'VoiceReview — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VoiceReview partial ready.'
    },
    success: {
      title: 'VoiceReview — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'VoiceReview success ready.'
    },
    locked: {
      title: 'VoiceReview — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'VoiceReview locked ready.'
    },
    review: {
      title: 'VoiceReview — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'VoiceReview review ready.'
    },
  },
  Documents: {
    default: {
      title: 'Documents — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Documents default ready.'
    },
    loading: {
      title: 'Documents — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Documents loading ready.'
    },
    empty: {
      title: 'Documents — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Documents empty ready.'
    },
    error: {
      title: 'Documents — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Documents error ready.'
    },
    offline: {
      title: 'Documents — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Documents offline ready.'
    },
    permission: {
      title: 'Documents — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Documents permission ready.'
    },
    partial: {
      title: 'Documents — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Documents partial ready.'
    },
    success: {
      title: 'Documents — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Documents success ready.'
    },
    locked: {
      title: 'Documents — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Documents locked ready.'
    },
    review: {
      title: 'Documents — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Documents review ready.'
    },
  },
  AIAnalysis: {
    default: {
      title: 'AIAnalysis — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'AIAnalysis default ready.'
    },
    loading: {
      title: 'AIAnalysis — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'AIAnalysis loading ready.'
    },
    empty: {
      title: 'AIAnalysis — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'AIAnalysis empty ready.'
    },
    error: {
      title: 'AIAnalysis — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'AIAnalysis error ready.'
    },
    offline: {
      title: 'AIAnalysis — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'AIAnalysis offline ready.'
    },
    permission: {
      title: 'AIAnalysis — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'AIAnalysis permission ready.'
    },
    partial: {
      title: 'AIAnalysis — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'AIAnalysis partial ready.'
    },
    success: {
      title: 'AIAnalysis — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'AIAnalysis success ready.'
    },
    locked: {
      title: 'AIAnalysis — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'AIAnalysis locked ready.'
    },
    review: {
      title: 'AIAnalysis — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'AIAnalysis review ready.'
    },
  },
  Checklist: {
    default: {
      title: 'Checklist — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Checklist default ready.'
    },
    loading: {
      title: 'Checklist — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Checklist loading ready.'
    },
    empty: {
      title: 'Checklist — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Checklist empty ready.'
    },
    error: {
      title: 'Checklist — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Checklist error ready.'
    },
    offline: {
      title: 'Checklist — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Checklist offline ready.'
    },
    permission: {
      title: 'Checklist — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Checklist permission ready.'
    },
    partial: {
      title: 'Checklist — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Checklist partial ready.'
    },
    success: {
      title: 'Checklist — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Checklist success ready.'
    },
    locked: {
      title: 'Checklist — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Checklist locked ready.'
    },
    review: {
      title: 'Checklist — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Checklist review ready.'
    },
  },
  TestDrive: {
    default: {
      title: 'TestDrive — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'TestDrive default ready.'
    },
    loading: {
      title: 'TestDrive — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'TestDrive loading ready.'
    },
    empty: {
      title: 'TestDrive — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'TestDrive empty ready.'
    },
    error: {
      title: 'TestDrive — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'TestDrive error ready.'
    },
    offline: {
      title: 'TestDrive — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'TestDrive offline ready.'
    },
    permission: {
      title: 'TestDrive — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'TestDrive permission ready.'
    },
    partial: {
      title: 'TestDrive — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'TestDrive partial ready.'
    },
    success: {
      title: 'TestDrive — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'TestDrive success ready.'
    },
    locked: {
      title: 'TestDrive — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'TestDrive locked ready.'
    },
    review: {
      title: 'TestDrive — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'TestDrive review ready.'
    },
  },
  Repairs: {
    default: {
      title: 'Repairs — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Repairs default ready.'
    },
    loading: {
      title: 'Repairs — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Repairs loading ready.'
    },
    empty: {
      title: 'Repairs — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Repairs empty ready.'
    },
    error: {
      title: 'Repairs — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Repairs error ready.'
    },
    offline: {
      title: 'Repairs — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Repairs offline ready.'
    },
    permission: {
      title: 'Repairs — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Repairs permission ready.'
    },
    partial: {
      title: 'Repairs — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Repairs partial ready.'
    },
    success: {
      title: 'Repairs — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Repairs success ready.'
    },
    locked: {
      title: 'Repairs — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Repairs locked ready.'
    },
    review: {
      title: 'Repairs — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Repairs review ready.'
    },
  },
  FairPrice: {
    default: {
      title: 'FairPrice — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'FairPrice default ready.'
    },
    loading: {
      title: 'FairPrice — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'FairPrice loading ready.'
    },
    empty: {
      title: 'FairPrice — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'FairPrice empty ready.'
    },
    error: {
      title: 'FairPrice — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'FairPrice error ready.'
    },
    offline: {
      title: 'FairPrice — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'FairPrice offline ready.'
    },
    permission: {
      title: 'FairPrice — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'FairPrice permission ready.'
    },
    partial: {
      title: 'FairPrice — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'FairPrice partial ready.'
    },
    success: {
      title: 'FairPrice — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'FairPrice success ready.'
    },
    locked: {
      title: 'FairPrice — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'FairPrice locked ready.'
    },
    review: {
      title: 'FairPrice — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'FairPrice review ready.'
    },
  },
  Negotiation: {
    default: {
      title: 'Negotiation — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Negotiation default ready.'
    },
    loading: {
      title: 'Negotiation — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Negotiation loading ready.'
    },
    empty: {
      title: 'Negotiation — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Negotiation empty ready.'
    },
    error: {
      title: 'Negotiation — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Negotiation error ready.'
    },
    offline: {
      title: 'Negotiation — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Negotiation offline ready.'
    },
    permission: {
      title: 'Negotiation — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Negotiation permission ready.'
    },
    partial: {
      title: 'Negotiation — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Negotiation partial ready.'
    },
    success: {
      title: 'Negotiation — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Negotiation success ready.'
    },
    locked: {
      title: 'Negotiation — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Negotiation locked ready.'
    },
    review: {
      title: 'Negotiation — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Negotiation review ready.'
    },
  },
  Report: {
    default: {
      title: 'Report — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Report default ready.'
    },
    loading: {
      title: 'Report — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Report loading ready.'
    },
    empty: {
      title: 'Report — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Report empty ready.'
    },
    error: {
      title: 'Report — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Report error ready.'
    },
    offline: {
      title: 'Report — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Report offline ready.'
    },
    permission: {
      title: 'Report — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Report permission ready.'
    },
    partial: {
      title: 'Report — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Report partial ready.'
    },
    success: {
      title: 'Report — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Report success ready.'
    },
    locked: {
      title: 'Report — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Report locked ready.'
    },
    review: {
      title: 'Report — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Report review ready.'
    },
  },
  Certificate: {
    default: {
      title: 'Certificate — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Certificate default ready.'
    },
    loading: {
      title: 'Certificate — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Certificate loading ready.'
    },
    empty: {
      title: 'Certificate — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Certificate empty ready.'
    },
    error: {
      title: 'Certificate — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Certificate error ready.'
    },
    offline: {
      title: 'Certificate — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Certificate offline ready.'
    },
    permission: {
      title: 'Certificate — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Certificate permission ready.'
    },
    partial: {
      title: 'Certificate — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Certificate partial ready.'
    },
    success: {
      title: 'Certificate — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Certificate success ready.'
    },
    locked: {
      title: 'Certificate — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Certificate locked ready.'
    },
    review: {
      title: 'Certificate — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Certificate review ready.'
    },
  },
  Contract: {
    default: {
      title: 'Contract — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Contract default ready.'
    },
    loading: {
      title: 'Contract — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Contract loading ready.'
    },
    empty: {
      title: 'Contract — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Contract empty ready.'
    },
    error: {
      title: 'Contract — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Contract error ready.'
    },
    offline: {
      title: 'Contract — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Contract offline ready.'
    },
    permission: {
      title: 'Contract — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Contract permission ready.'
    },
    partial: {
      title: 'Contract — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Contract partial ready.'
    },
    success: {
      title: 'Contract — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Contract success ready.'
    },
    locked: {
      title: 'Contract — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Contract locked ready.'
    },
    review: {
      title: 'Contract — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Contract review ready.'
    },
  },
  Signature: {
    default: {
      title: 'Signature — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Signature default ready.'
    },
    loading: {
      title: 'Signature — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Signature loading ready.'
    },
    empty: {
      title: 'Signature — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Signature empty ready.'
    },
    error: {
      title: 'Signature — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Signature error ready.'
    },
    offline: {
      title: 'Signature — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Signature offline ready.'
    },
    permission: {
      title: 'Signature — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Signature permission ready.'
    },
    partial: {
      title: 'Signature — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Signature partial ready.'
    },
    success: {
      title: 'Signature — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Signature success ready.'
    },
    locked: {
      title: 'Signature — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Signature locked ready.'
    },
    review: {
      title: 'Signature — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Signature review ready.'
    },
  },
  History: {
    default: {
      title: 'History — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'History default ready.'
    },
    loading: {
      title: 'History — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'History loading ready.'
    },
    empty: {
      title: 'History — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'History empty ready.'
    },
    error: {
      title: 'History — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'History error ready.'
    },
    offline: {
      title: 'History — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'History offline ready.'
    },
    permission: {
      title: 'History — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'History permission ready.'
    },
    partial: {
      title: 'History — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'History partial ready.'
    },
    success: {
      title: 'History — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'History success ready.'
    },
    locked: {
      title: 'History — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'History locked ready.'
    },
    review: {
      title: 'History — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'History review ready.'
    },
  },
  Compare: {
    default: {
      title: 'Compare — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Compare default ready.'
    },
    loading: {
      title: 'Compare — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Compare loading ready.'
    },
    empty: {
      title: 'Compare — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Compare empty ready.'
    },
    error: {
      title: 'Compare — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Compare error ready.'
    },
    offline: {
      title: 'Compare — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Compare offline ready.'
    },
    permission: {
      title: 'Compare — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Compare permission ready.'
    },
    partial: {
      title: 'Compare — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Compare partial ready.'
    },
    success: {
      title: 'Compare — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Compare success ready.'
    },
    locked: {
      title: 'Compare — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Compare locked ready.'
    },
    review: {
      title: 'Compare — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Compare review ready.'
    },
  },
  Profile: {
    default: {
      title: 'Profile — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Profile default ready.'
    },
    loading: {
      title: 'Profile — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Profile loading ready.'
    },
    empty: {
      title: 'Profile — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Profile empty ready.'
    },
    error: {
      title: 'Profile — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Profile error ready.'
    },
    offline: {
      title: 'Profile — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Profile offline ready.'
    },
    permission: {
      title: 'Profile — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Profile permission ready.'
    },
    partial: {
      title: 'Profile — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Profile partial ready.'
    },
    success: {
      title: 'Profile — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Profile success ready.'
    },
    locked: {
      title: 'Profile — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Profile locked ready.'
    },
    review: {
      title: 'Profile — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Profile review ready.'
    },
  },
  Paywall: {
    default: {
      title: 'Paywall — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Paywall default ready.'
    },
    loading: {
      title: 'Paywall — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Paywall loading ready.'
    },
    empty: {
      title: 'Paywall — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Paywall empty ready.'
    },
    error: {
      title: 'Paywall — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Paywall error ready.'
    },
    offline: {
      title: 'Paywall — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Paywall offline ready.'
    },
    permission: {
      title: 'Paywall — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Paywall permission ready.'
    },
    partial: {
      title: 'Paywall — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Paywall partial ready.'
    },
    success: {
      title: 'Paywall — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Paywall success ready.'
    },
    locked: {
      title: 'Paywall — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Paywall locked ready.'
    },
    review: {
      title: 'Paywall — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Paywall review ready.'
    },
  },
  Notifications: {
    default: {
      title: 'Notifications — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Notifications default ready.'
    },
    loading: {
      title: 'Notifications — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Notifications loading ready.'
    },
    empty: {
      title: 'Notifications — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Notifications empty ready.'
    },
    error: {
      title: 'Notifications — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Notifications error ready.'
    },
    offline: {
      title: 'Notifications — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Notifications offline ready.'
    },
    permission: {
      title: 'Notifications — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Notifications permission ready.'
    },
    partial: {
      title: 'Notifications — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Notifications partial ready.'
    },
    success: {
      title: 'Notifications — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Notifications success ready.'
    },
    locked: {
      title: 'Notifications — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Notifications locked ready.'
    },
    review: {
      title: 'Notifications — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Notifications review ready.'
    },
  },
  Settings: {
    default: {
      title: 'Settings — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Settings default ready.'
    },
    loading: {
      title: 'Settings — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Settings loading ready.'
    },
    empty: {
      title: 'Settings — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Settings empty ready.'
    },
    error: {
      title: 'Settings — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Settings error ready.'
    },
    offline: {
      title: 'Settings — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Settings offline ready.'
    },
    permission: {
      title: 'Settings — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Settings permission ready.'
    },
    partial: {
      title: 'Settings — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Settings partial ready.'
    },
    success: {
      title: 'Settings — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Settings success ready.'
    },
    locked: {
      title: 'Settings — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Settings locked ready.'
    },
    review: {
      title: 'Settings — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Settings review ready.'
    },
  },
  Share: {
    default: {
      title: 'Share — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Share default ready.'
    },
    loading: {
      title: 'Share — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Share loading ready.'
    },
    empty: {
      title: 'Share — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Share empty ready.'
    },
    error: {
      title: 'Share — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Share error ready.'
    },
    offline: {
      title: 'Share — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Share offline ready.'
    },
    permission: {
      title: 'Share — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Share permission ready.'
    },
    partial: {
      title: 'Share — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Share partial ready.'
    },
    success: {
      title: 'Share — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Share success ready.'
    },
    locked: {
      title: 'Share — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Share locked ready.'
    },
    review: {
      title: 'Share — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Share review ready.'
    },
  },
  Help: {
    default: {
      title: 'Help — default state',
      message: 'Ready for the next action.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Help default ready.'
    },
    loading: {
      title: 'Help — loading state',
      message: 'Loading the next visual layer.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Help loading ready.'
    },
    empty: {
      title: 'Help — empty state',
      message: 'Nothing here yet — add evidence to continue.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Help empty ready.'
    },
    error: {
      title: 'Help — error state',
      message: 'We saved your work. Try again without restarting.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'danger',
      haptic: 'error',
      announcement: 'Help error ready.'
    },
    offline: {
      title: 'Help — offline state',
      message: 'You can keep reviewing saved inspection data.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Help offline ready.'
    },
    permission: {
      title: 'Help — permission state',
      message: 'Permission is needed for this part of the workflow.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Help permission ready.'
    },
    partial: {
      title: 'Help — partial state',
      message: 'Some evidence is available; review the remaining gaps.',
      primary: 'Continue',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Help partial ready.'
    },
    success: {
      title: 'Help — success state',
      message: 'This step is complete and ready to continue.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'success',
      haptic: 'success',
      announcement: 'Help success ready.'
    },
    locked: {
      title: 'Help — locked state',
      message: 'Complete the previous step to unlock this view.',
      primary: 'Review',
      secondary: 'Go back',
      tone: 'info',
      haptic: 'selection',
      announcement: 'Help locked ready.'
    },
    review: {
      title: 'Help — review state',
      message: 'Human review is recommended before moving on.',
      primary: 'Continue',
      secondary: 'Dismiss',
      tone: 'warning',
      haptic: 'selection',
      announcement: 'Help review ready.'
    },
  },
};

export const getState=(screen,state='default')=>UX_STATE_MATRIX[screen]?.[state]||UX_STATE_MATRIX.Home.default;

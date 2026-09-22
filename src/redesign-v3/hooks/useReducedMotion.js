import {useEffect,useState} from 'react'; import {AccessibilityInfo} from 'react-native';
export default function useReducedMotion(){const[r,setR]=useState(false);useEffect(()=>{AccessibilityInfo.isReduceMotionEnabled?.().then(v=>setR(!!v)).catch(()=>{});const s=AccessibilityInfo.addEventListener?.('reduceMotionChanged',setR);return()=>s?.remove?.()},[]);return r;}

import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function VisualStatePill({state='ready',label}){
 const map={ready:COLORS.cyan,success:COLORS.mint,watch:COLORS.amber,danger:COLORS.coral,offline:COLORS.muted};const c=map[state]||map.ready;return <View style={{alignSelf:'flex-start',paddingVertical:5,paddingHorizontal:9,borderRadius:RADIUS.pill,borderWidth:1,borderColor:c,backgroundColor:'rgba(255,255,255,.02)',flexDirection:'row',alignItems:'center',gap:6}}><View style={{width:6,height:6,borderRadius:3,backgroundColor:c}}/><Text variant="caption" color={c}>{label||state}</Text></View>;
}

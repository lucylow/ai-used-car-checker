import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import Icon from './Icon';
import {COLORS,RADIUS} from '../tokens';
export default function DocumentEvidence({title='Document',type='PDF',status='Verified',confidence=94,onPress}) {
  return <View onTouchEnd={onPress} style={{padding:14,borderRadius:RADIUS.lg,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,flexDirection:'row',gap:12,alignItems:'center'}}>
    <View style={{width:46,height:52,borderRadius:12,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Icon name="document" color={COLORS.cyan}/><Text variant="caption" color={COLORS.cyan} style={{marginTop:2}}>{type}</Text></View>
    <View style={{flex:1}}><Text variant="bodyStrong">{title}</Text><Text variant="caption" muted style={{marginTop:3}}>{confidence}% extraction confidence</Text></View>
    <Badge label={status} tone={status==='Verified'?'success':status==='Review'?'watch':'info'}/>
  </View>;
}

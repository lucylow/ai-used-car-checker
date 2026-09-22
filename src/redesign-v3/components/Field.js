import React from 'react';
import {TextInput,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function Field({label,value,onChangeText,placeholder,keyboardType='default',mono=false}) {
  return <View style={{marginBottom:12}}><Text variant="caption" muted>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.muted} keyboardType={keyboardType} style={{marginTop:6,minHeight:50,paddingHorizontal:13,borderRadius:RADIUS.md,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,color:COLORS.white,fontFamily:mono?'monospace':undefined}}/></View>;
}

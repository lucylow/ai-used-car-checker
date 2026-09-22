import React from 'react';
import {TextInput,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function TextArea({label,value,onChangeText,placeholder,rows=5}) {
  return <View style={{marginBottom:12}}><Text variant="caption" muted>{label}</Text><TextInput multiline value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.muted} textAlignVertical="top" style={{marginTop:6,minHeight:rows*24+20,padding:13,borderRadius:RADIUS.md,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,color:COLORS.white}}/></View>;
}

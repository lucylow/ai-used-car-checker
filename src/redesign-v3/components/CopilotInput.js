import React,{useState} from 'react';
import {Pressable,TextInput,View} from 'react-native';
import Icon from './Icon';
import {COLORS,RADIUS} from '../tokens';
export default function CopilotInput({onSend,onAttach}) {
  const [value,setValue]=useState('');
  const send=()=>{if(value.trim()){onSend?.(value.trim());setValue('');}};
  return <View style={{flexDirection:'row',alignItems:'center',gap:8,padding:7,borderRadius:RADIUS.xl,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface}}>
    <Pressable onPress={onAttach} accessibilityLabel="Attach evidence"><Icon name="attach" color={COLORS.cyan}/></Pressable>
    <TextInput value={value} onChangeText={setValue} onSubmitEditing={send} placeholder="Ask CarWise…" placeholderTextColor={COLORS.muted} style={{flex:1,color:COLORS.white,minHeight:42}} returnKeyType="send"/>
    <Pressable onPress={send} accessibilityLabel="Send question" style={{width:40,height:40,borderRadius:20,backgroundColor:COLORS.blue,alignItems:'center',justifyContent:'center'}}><Icon name="arrow-up" color={COLORS.white}/></Pressable>
  </View>;
}

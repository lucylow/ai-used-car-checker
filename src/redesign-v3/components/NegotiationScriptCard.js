import React,{useState} from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function NegotiationScriptCard({title='Opening offer',script='I like the vehicle. Based on the comparable market data and the visible repair items, I would be comfortable at $19,400.',evidence=[]}){
 const [copied,setCopied]=useState(false);
 return <View style={{padding:15,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text variant="h3">{title}</Text><Pressable onPress={()=>setCopied(true)}><Text variant="caption" color={COLORS.cyan}>{copied?'Copied':'Copy'}</Text></Pressable></View><Text style={{marginTop:10}}>{script}</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:11}}>{evidence.map((e,i)=><View key={i} style={{paddingVertical:4,paddingHorizontal:8,borderRadius:RADIUS.pill,backgroundColor:COLORS.surface2}}><Text variant="caption" muted>{e}</Text></View>)}</View></View>;
}

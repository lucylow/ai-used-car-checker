import React,{useState} from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import ConfidenceBar from './ConfidenceBar';
import {COLORS,RADIUS} from '../tokens';
export default function AiConfidenceExplainer({confidence=87,evidence=[],note='AI estimate; confirm important findings before purchase.'}){
 const [open,setOpen]=useState(false);
 return <View style={{borderRadius:RADIUS.lg,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,overflow:'hidden'}}>
  <Pressable onPress={()=>setOpen(v=>!v)} style={{padding:13}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text variant="bodyStrong">Why this confidence?</Text><Text variant="caption" color={COLORS.cyan}>{open?'Hide':'View'}</Text></View><View style={{marginTop:9}}><ConfidenceBar value={confidence}/></View></Pressable>
  {open?<View style={{padding:13,paddingTop:0}}><Text variant="caption" muted>{note}</Text>{evidence.map((x,i)=><View key={i} style={{flexDirection:'row',gap:8,alignItems:'center',paddingVertical:7}}><View style={{width:6,height:6,borderRadius:3,backgroundColor:COLORS.cyan}}/><Text variant="caption">{x}</Text></View>)}</View>:null}
 </View>;
}

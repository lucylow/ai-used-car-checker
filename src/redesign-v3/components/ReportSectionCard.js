import React,{useState} from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function ReportSectionCard({title,eyebrow,summary,children,defaultOpen=false,icon='•'}){
 const [open,setOpen]=useState(defaultOpen);
 return <View style={{borderRadius:RADIUS.xl,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,overflow:'hidden',marginBottom:10}}><Pressable onPress={()=>setOpen(v=>!v)} style={{padding:15}}><View style={{flexDirection:'row',gap:10,alignItems:'center'}}><View style={{width:34,height:34,borderRadius:12,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text color={COLORS.cyan}>{icon}</Text></View><View style={{flex:1}}>{eyebrow?<Text variant="caption" color={COLORS.cyan}>{eyebrow}</Text>:null}<Text variant="h3" style={{marginTop:eyebrow?2:0}}>{title}</Text>{summary?<Text variant="caption" muted style={{marginTop:3}}>{summary}</Text>:null}</View><Text variant="caption" color={COLORS.cyan}>{open?'−':'+'}</Text></View></Pressable>{open?<View style={{padding:15,paddingTop:0}}>{children}</View>:null}</View>;
}

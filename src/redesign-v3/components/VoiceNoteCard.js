import React,{useState} from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import VoiceWave from './VoiceWave';
import {COLORS,RADIUS} from '../tokens';
export default function VoiceNoteCard({title='Voice observation',transcript='Clicking noise appears when steering left.',duration='00:09'}){
 const [playing,setPlaying]=useState(false);
 return <View style={{padding:13,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
  <View style={{flexDirection:'row',alignItems:'center',gap:10}}><Pressable onPress={()=>setPlaying(v=>!v)} style={{width:42,height:42,borderRadius:21,backgroundColor:COLORS.blue,alignItems:'center',justifyContent:'center'}}><Text variant="h3">{playing?'❚❚':'▶'}</Text></Pressable><View style={{flex:1}}><Text variant="bodyStrong">{title}</Text><Text variant="caption" muted>{duration}</Text></View><Text variant="caption" color={COLORS.cyan}>{playing?'Playing':'Ready'}</Text></View>
  <View style={{marginTop:10}}><VoiceWave active={playing}/></View><Text variant="caption" style={{marginTop:9}}>{transcript}</Text>
 </View>;
}

import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import VideoTimeline from './VideoTimeline';
import {COLORS,RADIUS} from '../tokens';
export default function VideoEvidenceCard({title='Engine running',duration='00:12',events=[],status='Review',onPress}){
 return <Pressable onPress={onPress} style={{padding:13,borderRadius:RADIUS.xl,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface}}>
  <View style={{height:100,borderRadius:16,backgroundColor:COLORS.navy2,borderWidth:1,borderColor:COLORS.line,justifyContent:'center',alignItems:'center'}}><View style={{width:52,height:52,borderRadius:26,backgroundColor:COLORS.blue,alignItems:'center',justifyContent:'center'}}><Text variant="h3">▶</Text></View><Text variant="caption" color={COLORS.white} style={{position:'absolute',right:9,bottom:8}}>{duration}</Text></View>
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}><View style={{flex:1}}><Text variant="bodyStrong">{title}</Text><Text variant="caption" muted>{events.length} detected event{events.length===1?'':'s'}</Text></View><Badge label={status} tone={status==='Verified'?'success':'watch'}/></View>
  <View style={{marginTop:10}}><VideoTimeline events={events}/></View>
 </Pressable>;
}

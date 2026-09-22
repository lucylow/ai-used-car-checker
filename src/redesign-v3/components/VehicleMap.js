import React,{useMemo} from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import {COLORS,RADIUS} from '../tokens';
const zones=[['hood','Hood'],['roof','Roof'],['left','Driver side'],['right','Passenger side'],['front','Front'],['rear','Rear'],['interior','Interior']];
export default function VehicleMap({onZone,issues={front:2,hood:1,left:0,right:1,rear:0,interior:1,roof:0}}) {
  const safe=useMemo(()=>issues||{},[issues]);
  return <View style={{padding:14,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
    <View style={{alignItems:'center',paddingVertical:16}}>
      <View style={{width:150,height:280,borderRadius:60,borderWidth:3,borderColor:COLORS.line,backgroundColor:COLORS.navy2,alignItems:'center',justifyContent:'center'}}>
        <View style={{width:82,height:190,borderRadius:30,borderWidth:2,borderColor:COLORS.cyan,backgroundColor:COLORS.surface2}}/>
        <View style={{position:'absolute',top:22,width:70,height:16,borderRadius:8,backgroundColor:COLORS.blue,opacity:.8}}/>
        <View style={{position:'absolute',bottom:22,width:70,height:16,borderRadius:8,backgroundColor:COLORS.blue,opacity:.45}}/>
      </View>
    </View>
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
      {zones.map(([key,label])=><Pressable key={key} onPress={()=>onZone?.(key)} style={{paddingVertical:9,paddingHorizontal:11,borderRadius:RADIUS.pill,backgroundColor:COLORS.surface2,borderWidth:1,borderColor:(safe[key]||0)>0?COLORS.amber:COLORS.line}}>
        <Text variant="caption">{label}</Text>{(safe[key]||0)>0?<Text variant="caption" color={COLORS.amber} style={{marginTop:2}}>{safe[key]} issue{safe[key]>1?'s':''}</Text>:null}
      </Pressable>)}
    </View>
  </View>;
}

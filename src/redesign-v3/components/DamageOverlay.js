import React from 'react';
import {View,Image} from 'react-native';
import DamagePin from './DamagePin';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function DamageOverlay({uri,pins=[]}){
 return <View style={{aspectRatio:4/3,borderRadius:RADIUS.xl,overflow:'hidden',backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
  {uri?<Image source={{uri}} style={{width:'100%',height:'100%'}} resizeMode="cover"/>:<View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text muted>No image selected</Text></View>}
  <View style={{position:'absolute',inset:0}}>{pins.map((p,i)=><DamagePin key={i} {...p}/>)}</View>
 </View>;
}

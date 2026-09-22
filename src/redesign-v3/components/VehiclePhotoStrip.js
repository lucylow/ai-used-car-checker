import React from 'react';
import {ScrollView,Pressable,View} from 'react-native';
import Text from './Text';
import MediaTile from './MediaTile';
import {COLORS} from '../tokens';
export default function VehiclePhotoStrip({items=[],active=0,onSelect}){
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingVertical:4}}>
  {items.map((item,i)=><Pressable key={i} onPress={()=>onSelect?.(i)} accessibilityLabel={`Vehicle photo ${i+1}`}>
   <View style={{borderRadius:14,borderWidth:2,borderColor:i===active?COLORS.cyan:'transparent',padding:2}}>
    <MediaTile item={item} />
   </View>
  </Pressable>)}
  {!items.length?<View style={{padding:18,borderRadius:16,backgroundColor:COLORS.surface2}}><Text variant="caption" muted>No vehicle photos yet</Text></View>:null}
 </ScrollView>;
}

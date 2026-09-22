import React from 'react';
import {FlatList,Pressable,View} from 'react-native';
import Text from './Text';
import MediaTile from './MediaTile';
import EvidenceCount from './EvidenceCount';
export default function EvidenceGrid({items=[],numColumns=2,onOpen}){
 return <FlatList data={items} numColumns={numColumns} scrollEnabled={false} keyExtractor={(_,i)=>String(i)} columnWrapperStyle={{gap:8}} contentContainerStyle={{gap:8}} renderItem={({item,index})=><Pressable onPress={()=>onOpen?.(item,index)} style={{flex:1}}>
  <View><MediaTile item={item}/>{item.count!=null?<View style={{position:'absolute',right:8,top:8}}><EvidenceCount count={item.count}/></View>:null}<Text variant="caption" muted style={{marginTop:5}} numberOfLines={1}>{item.label||`Evidence ${index+1}`}</Text></View>
 </Pressable>}/>
}

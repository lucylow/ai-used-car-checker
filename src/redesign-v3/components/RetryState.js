import React from 'react';
import {View,Pressable} from 'react-native';
import Text from './Text';
import Button from './Button';
import {COLORS,RADIUS} from '../tokens';
export default function RetryState({title='Something went wrong',message='Your progress is safe. Try the request again or continue with the saved inspection.',onRetry,onContinue}){
 return <View style={{padding:18,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line,alignItems:'center'}}><View style={{width:54,height:54,borderRadius:27,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text variant="h2" color={COLORS.amber}>!</Text></View><Text variant="h2" style={{marginTop:12,textAlign:'center'}}>{title}</Text><Text muted style={{marginTop:5,textAlign:'center'}}>{message}</Text><View style={{width:'100%',marginTop:14}}><Button title="Retry" onPress={onRetry}/></View><Pressable onPress={onContinue} style={{marginTop:11}}><Text variant="caption" color={COLORS.cyan}>Continue with saved data</Text></Pressable></View>;
}

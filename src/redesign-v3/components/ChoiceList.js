import React from 'react';
import ChoiceCard from './ChoiceCard';
export default function ChoiceList({items=[],value,onChange}) {
  return <>{items.map(item=><ChoiceCard key={item.value||item.title} {...item} selected={value===(item.value||item.title)} onPress={()=>onChange?.(item.value||item.title)}/>)}</>;
}

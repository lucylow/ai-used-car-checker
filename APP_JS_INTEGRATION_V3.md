# App.js integration example

```jsx
import React, {useState} from 'react';
import {RedesignV3Shell} from './src/redesign-v3';

export default function App(){
  const [showRedesign,setShowRedesign] = useState(true);

  if(showRedesign){
    return <RedesignV3Shell
      initialRoute="home"
      vehicle={/* map current inspection vehicle here */ undefined}
      onExit={()=>setShowRedesign(false)}
    />;
  }

  // Existing CarWise App.js below this point.
  return null;
}
```

## Real integration pattern

Do not leave `vehicle={undefined}` in production. Pass the current vehicle object from the existing inspection state, then replace demo callbacks with existing actions.

In this repository, the first integration step is intentionally preview-only: set the existing `screen` state to `v3-preview` to open the V3 shell, then use its exit action to return to `home`. The current production path remains the V2 `RedesignShell` branch.

The preview bridge normalizes the host vehicle's `asking` value into V3's `askingPrice` field and converts persisted photo objects into V3 photo URI strings. This is presentation data only; findings, market values, report generation, and media mutations still need real action adapters.

For example:

```jsx
const handleNavigate=(route)=>navigation.navigate(route);
const handleEvidence=(item)=>setSelectedEvidence(item);
const handleIssueSave=(issue)=>saveInspectionIssue(issue);
const handleReportExport=()=>generateReport();
```

The V3 screen components are intentionally small enough to be wired to these existing functions without moving business logic into the UI layer.

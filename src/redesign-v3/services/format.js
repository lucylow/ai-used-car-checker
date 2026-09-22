export const money=n=>`$${Math.round(n||0).toLocaleString()}`;
export const mileage=n=>`${Math.round(n||0).toLocaleString()} mi`;
export const vehicleLabel=v=>`${v?.year||''} ${v?.make||''} ${v?.model||''}`.trim();
export const percent=n=>`${Math.round((n||0)*100)}%`;

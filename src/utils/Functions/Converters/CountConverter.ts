export const CountConverter = (val : any)=>{
    let str = (val || 0) + '' as string;
    if(val >= 1000){val = val/1000; str = val.toFixed(1) + 'K'}
    if(val >= 1000){val = val/1000; str = val.toFixed(1) + 'M'}
    if(val >= 1000){val = val/1000; str = val.toFixed(1) + 'B'}
    return str;
}
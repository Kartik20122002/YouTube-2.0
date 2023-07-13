export const CountConverter = (val : any)=>{
    let str = val + '' as string;
    if(val >= 1000){val = val/1000; str = Math.trunc(val) + 'K'}
    if(val >= 1000){val = val/1000; str = Math.trunc(val) + 'M'}
    if(val >= 1000){val = val/1000; str = Math.trunc(val) + 'B'}
    return str;
}
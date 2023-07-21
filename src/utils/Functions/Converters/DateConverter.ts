export const DateConverter = (val : any)=>{
    let d1 = new Date(val || 0) as any;
    let d2 = new Date() as any;
    let date = Math.abs(d2-d1) as any;
    date = date/(1000);
    let time = Math.trunc(date) + " secs"
    if(date >= 60){ date = date/60; time = Math.trunc(date) + " mins";
    if(date >= 60){ date = date/60; time = Math.trunc(date) + " hours";
        if(date >= 24){ date = date/24; time = Math.trunc(date) + " days";
            if(date >= 31){ date = date/30.4167; time = Math.trunc(date) + " months";
                if(date >= 12){ date = date/12; time = Math.trunc(date) + " years";
                }
            }
        }
    }
    }

    return time;
}
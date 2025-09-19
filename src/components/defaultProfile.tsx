    export const defaultProfile =(name:string)=>{
      let profileName = ""
      if(name.includes(" ")){
        const arr = name.split(" ")
          for( const el of arr){
            profileName += el.slice(0,1)
          }
          return profileName.toLocaleUpperCase()
      }else{
        return name.slice(0,2).toUpperCase()
      }
    }
 
export const defaultProfile =(firstname:string, lastname:string)=>{
  const profileName = firstname[0] + lastname[0]
  return profileName.toUpperCase()
}
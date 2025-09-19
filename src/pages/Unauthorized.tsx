import { OctagonX } from 'lucide-react';
const Unauthorized = () => {
  return (
    <div className='flex items-center justify-center'>
        <div className='flex gap-3 items-center'>
            <h1>You are not authorized </h1><OctagonX color='#a01818' size={45} /> 
        </div>
    </div>
  )
}

export default Unauthorized


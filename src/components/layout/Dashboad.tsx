import { useState } from "react";
import logo from "../../assets/paypal-blue.png";
import { NavLink, Outlet, useNavigate } from 'react-router'
import { Bell, Contact, Menu, UserPlus, WalletCards, X } from 'lucide-react'
import { Button } from "../ui/button";


const Dashboad = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const toggleMenu = ()=>{
    setIsOpen( prev => !prev);
  }

  const logoutUser = () =>{
    localStorage.removeItem("token")
    navigate("/")
  }


  return (
    <div className='flex items-start bg-white w-full h-screen relative overflow-y-hidden' >
      <aside onClick={()=>setIsOpen(false)} className={`w-[300px] sm:w-[200px] lg:w-[15%] h-full p-5 shadow-xl flex flex-col gap-6 bg-white z-10 transform transition-transform duration-500 ease-in-out fixed sm:relative top-0 left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'} `}>
        <div className='mb-10 flex items-center w-full gap-3 rounded relative overflow-hidden cursor-pointer group'>
          <img src={logo} alt="logo image" width={150} />
        </div>

        <nav className="flex flex-col gap-5 pt-[70px]">
          <NavLink 
            to='/dashboard/create-client' 
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? 'bg-blue-100' : ''
              }`
            }
          >
            <UserPlus className="bg-blue-300 text-blue-600 p-[5px] h-[30px] w-[30px] rounded"/>
            <span className="text-black font-medium">Create</span>
          </NavLink>

          <NavLink 
            to="/dashboard/client-list" 
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? 'bg-blue-100' : ''
              }`
            }
          >
            <Contact className="bg-blue-300 text-blue-600  p-[5px] h-[30px] w-[30px] rounded" />
            <span className="text-black font-medium">Users</span>
          </NavLink>

          <NavLink 
            to="/dashboard/card-list" 
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? 'bg-blue-100' : ''
              }`
            }
          >
            <WalletCards className="bg-blue-300 text-blue-600 p-[5px] h-[30px] w-[30px] rounded"/>
            <span className="text-black font-medium">Cards</span>
          </NavLink>
       
        </nav>
      </aside>

      <div className='w-[85%] h-full flex flex-1 flex-col overflow-hidden'>
        <nav className='w-full px-7 py-5 flex items-center justify-between border-b-1 shadow-md'>
          <div className='flex flex-row-reverse items-center gap-3'>
            <p>Admin 👋</p>
            <span className='w-[40px] h-[40px] rounded-full bg-blue-200 text-blue-600 flex items-center justify-center'>
              <Bell size={24} />
            </span>
          </div>
          <Button onClick={logoutUser} className="rounded">Log out</Button>
          <span onClick={toggleMenu} className='flex sm:hidden cursor-pointer'>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </span>
        </nav>
        <main className='flex-1 w-full overflow-y-auto px-7 py-5'>
          <div className='min-h-screen'>
            <Outlet  />
          </div>
        </main>
      </div>
    </div>

  )
}

export default Dashboad
import {NavLink} from "react-router-dom";
import AvatarWithDropdown from "../utils/AvatarWithDropdown";
const Navbar=()=>{
   return (
       <div className="h-[50px] bg-yellow-200 flex justify-between items-center  mx-20 px-20 ">
            <div className="h-[50px] text-3xl text-bold flex items-center">
                   Lost<span className="text-red-500">&Found</span>
            </div>
            <div className="flex flex-row gap-10">
                 <div className=" flex flex-row gap-10 items-center">
                     <NavLink>Lost</NavLink>
                     <NavLink>Lost</NavLink>
                     <NavLink>Lost</NavLink>
                     <NavLink>Lost</NavLink>
                     
                 </div>
                 <div className="h-10 w-10 bg-black rounded-full ">
                      <AvatarWithDropdown></AvatarWithDropdown>
                 </div>
                 
            </div>
           
       </div>
   )
}

export default Navbar;
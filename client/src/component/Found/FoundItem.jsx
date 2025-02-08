function FoundItem({data}){
    const token=true;
   return (
      <div className="flex flex-col  rounded-lg shadow-sm bg-yellow-300 px-10 py-10 my-10">
           <div className="flex items-center gap-4 pb-2">
               <div className=" h-[40px] w-[40px] rounded-full bg-red-400 "  ></div>
               <div>{data.postby.name}</div>
           </div>
           <div className="h-[1px] w-full bg-red-500 mb-2">
           </div>
           <div>
           <div>Description:-</div>
                <div>{data.description}</div>
                {/* <div className="h-[1px] w-full bg-red-500 mb-2"></div> */}
                <div>Location- <span>{data.location}</span> </div>
           </div>
           {
            token==true?
            (<div>
               <div className="w-[80%] text-center rounded-lg h-8 bg-red-400">
                  Claim Item
               </div>

            </div>)
            :(<div>
               <div className="w-[80%] text-center rounded-lg h-8 bg-red-400">
                  Close Item
               </div>

            </div>)
           }
      </div>
   )
}
 export default FoundItem;
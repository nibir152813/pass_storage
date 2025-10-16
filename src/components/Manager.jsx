import React from "react";
import { useRef } from "react"; 
const Manager = () => {
  const ref = useRef();
  const showPassword = () => {
    alert("Show Password");
    if(ref.current.src.includes("icons/eyecross.png")){
      ref.current.src="icons/eye.png"
    }
    else{
      ref.current.src="icons/eyecross.png"
    }
  }
  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="  mycontainer">
        <h1 className="text-4xl text font-bold text-center">
         
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-center text-lg">Your own Password Manager</p>

        <div className=" flex flex-col p-4 text-black gap-8 items-center">
          <input placeholder="Enter Website URL" className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black" type="text" name="" id="" />
          <div className="flex w-full justify-between gap-8">
           <input placeholder="Enter Username" className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black" type="text" name="" id="" />
           <div className="relative">

          
            <input placeholder="Enter Password" className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black" type="text" name="" id="" />
            
            <span className="absolute right-[3px] top-[4px] cursor-pointer" onClick={showPassword}><img ref={ref} className='p-1' width={26}src="icons/eye.png" alt="eye" /></span>
          


           </div>
          </div>
          
          <button className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900">
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover">
              
              </lord-icon>
            
            Add Password</button>
        </div>
      </div>
    </>
  );
};

export default Manager;

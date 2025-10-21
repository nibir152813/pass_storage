import React, { use } from "react";
import { useRef, useState, useEffect } from "react"; 



const Manager = () => {
  const ref = useRef();
  const [form, setForm] = useState({site:"" , username:"" , password:""});
  const[passwordArray, setPasswordArray] = useState([]);


  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
    }
  }, []);
  

  const showPassword = () => {
    alert("Show Password");
    if(ref.current.src.includes("icons/eyecross.png")){
      ref.current.src="icons/eye.png"
    }
    else{
      ref.current.src="icons/eyecross.png"
    }
  }

  const savePassword = () => {
   setPasswordArray([...passwordArray, form]);
   localStorage.setItem("password", JSON.stringify([...passwordArray, form]));
   console.log([...passwordArray, form]);

  } 

  const handleChage = (e) => {
    setForm({...form , [e.target.name]:e.target.value})
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
          <span className="text-green-500">ST/&gt;</span>
        </h1>
        <p className="text-green-900 text-center text-lg">
          Your own Password Manager
        </p>

        <div className=" flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChage}
            placeholder="Enter Website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black"
            type="text"
            name="site"
            id=""
          />
          <div className="flex w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChage}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black"
              type="text"
              name="username"
              id=""
            />
            <div className="relative">
              <input
                value={form.password}
                onChange={handleChage}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black"
                type="text"
                name="password"
                id=""
              />

              <span
                className="absolute right-[3px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img ref={ref}className="p-1"width={26}src="icons/eye.png"alt="eye"/>
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
            ></lord-icon>
            Add Password
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Password</h2>
          {passwordArray.length === 0 && <div>No password to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item,index) => {
                  return <tr key={index}>

                  
                    <td className="p-2 border border-white text-center w-32">
                      <a href={item.site} target="_blank">{item.site}</a>
                    </td>
                    <td className="p-2 border border-white text-center w-32">
                      {item.username}
                    </td>
                    <td className="p-2 border border-white text-center w-32">
                      {item.password}
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;

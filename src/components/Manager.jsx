import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { Eye, EyeOff, Copy, Save, Edit2, Trash2, X } from "lucide-react";

const maskPassword = (password) => {
  return "•".repeat(password.length);
};

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPassword, setDialogPassword] = useState("");
  const [currentPasswordData, setCurrentPasswordData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Main account credentials (should match Login.jsx)
  const MASTER_PASSWORD = "123456";

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
    }
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const toggleFormPassword = () => {
    setShowFormPassword(!showFormPassword);
  };

  const handleShowSavedPassword = (item) => {
    setCurrentPasswordData(item);
    setShowDialog(true);
    setIsVerified(false);
    setDialogPassword("");
  };

  const handleDialogSubmit = () => {
    if (dialogPassword === MASTER_PASSWORD) {
      toast.success("Password verified!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      setIsVerified(true);
      setDialogPassword("");
    } else {
      toast.error("Incorrect master password!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setDialogPassword("");
    setCurrentPasswordData(null);
    setIsVerified(false);
  };

  const savePassword = () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
      localStorage.setItem(
        "passwords",
        JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
      );
      console.log([...passwordArray, form]);
      setForm({ site: "", username: "", password: "" });

      toast("Password saved Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("Error: Password not saved!");
    }
  };

  const deletePassword = (id) => {
    console.log("Deleting password with id ", id);
    let c = confirm("Are you sure you want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      localStorage.setItem(
        "passwords",
        JSON.stringify(passwordArray.filter((item) => item.id !== id))
      );
      toast("Password Deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = (id) => {
    console.log("Editing password with id ", id);
    setForm(passwordArray.filter((i) => i.id === id)[0]);
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChage = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Password Verification Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isVerified ? "Password Details" : "Verify Master Password"}
              </h2>
              <button
                onClick={handleDialogClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {!isVerified ? (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your master password to view this saved password.
                </p>

                <input
                  type="password"
                  value={dialogPassword}
                  onChange={(e) => setDialogPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleDialogSubmit()}
                  placeholder="Enter master password"
                  className="w-full p-4 border-2 border-green-500 rounded-full mb-6 focus:outline-none focus:border-green-600 transition-colors"
                  autoFocus
                />

                <div className="flex gap-4">
                  <button
                    onClick={handleDialogClose}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDialogSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-full font-bold transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Site */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                      Site
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={currentPasswordData?.site}
                        target="_blank"
                        className="text-blue-600 hover:underline break-all flex-1"
                      >
                        {currentPasswordData?.site}
                      </a>
                      <button
                        onClick={() => copyText(currentPasswordData?.site)}
                        className="flex-shrink-0 hover:bg-green-100 p-1 rounded transition-colors"
                      >
                        <Copy size={20} className="text-green-600" />
                      </button>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                      Username
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <span className="break-all flex-1">
                        {currentPasswordData?.username}
                      </span>
                      <button
                        onClick={() => copyText(currentPasswordData?.username)}
                        className="flex-shrink-0 hover:bg-green-100 p-1 rounded transition-colors"
                      >
                        <Copy size={20} className="text-green-600" />
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                      Password
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono break-all flex-1">
                        {currentPasswordData?.password}
                      </span>
                      <button
                        onClick={() => copyText(currentPasswordData?.password)}
                        className="flex-shrink-0 hover:bg-green-100 p-1 rounded transition-colors"
                      >
                        <Copy size={20} className="text-green-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDialogClose}
                  className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white py-3 rounded-full font-bold transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="fixed inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="mycontainer min-h-[calc(100vh-112px)]">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">ST/&gt;</span>
        </h1>
        <p className="text-green-900 text-center text-lg">
          Your own Password Manager
        </p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChage}
            placeholder="Enter Website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChage}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChage}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black pr-10"
                type={showFormPassword ? "text" : "password"}
                name="password"
                id="password"
              />

              <button
                onClick={toggleFormPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showFormPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900 transition-colors"
          >
            <Save size={20} />
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Password</h2>
          {passwordArray.length === 0 && <div>No password to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={item.site}
                            target="_blank"
                            className="hover:underline"
                          >
                            {item.site}
                          </a>

                          <button
                            onClick={() => copyText(item.site)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                          >
                            <Copy size={18} className="text-green-700" />
                          </button>
                        </div>
                      </td>

                      <td className="p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>{item.username}</span>
                          <button
                            onClick={() => copyText(item.username)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                          >
                            <Copy size={18} className="text-green-700" />
                          </button>
                        </div>
                      </td>
                      <td className="p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>{maskPassword(item.password)}</span>

                          {/* Eye icon to show password with verification */}
                          <button
                            onClick={() => handleShowSavedPassword(item)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                            title="View password"
                          >
                            <Eye size={18} className="text-green-700" />
                          </button>

                          {/* Copy icon */}
                          <button
                            onClick={() => copyText(item.password)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                          >
                            <Copy size={18} className="text-green-700" />
                          </button>
                        </div>
                      </td>
                      <td className="justify-center p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => editPassword(item.id)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => deletePassword(item.id)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Manager;

import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, Copy, Save, Edit2, Trash2, X } from "lucide-react";
import { passwordAPI, getUser, authAPI, setUser } from "../utils/api";
import bkashNagad from "../assets/bkash_nagad.png";

const maskPassword = (password) => {
  return "•".repeat(password.length);
};

const Manager = () => {
  const MAX_PASSWORDS = 10;
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPassword, setDialogPassword] = useState("");
  const [currentPasswordData, setCurrentPasswordData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(getUser());
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const isPremium = Boolean(currentUser?.isPremium);

  useEffect(() => {
    syncUser();
    fetchPasswords();
  }, []);

  const syncUser = async () => {
    try {
      const response = await authAPI.verify();
      if (response?.user) {
        setUser(response.user);
        setCurrentUser(response.user);
      }
    } catch {
      // ignore - App will handle logout if needed
    }
  };

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const response = await passwordAPI.getAll();
      setPasswordArray(response.passwords || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch passwords");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDialogSubmit = async () => {
    if (!dialogPassword) {
      toast.error("Please enter your login password!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    try {
      await authAPI.verifyPassword(dialogPassword);
      toast.success("Password verified!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      setIsVerified(true);
      setDialogPassword("");
    } catch (error) {
      toast.error(error.message || "Incorrect password!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      setDialogPassword("");
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setDialogPassword("");
    setCurrentPasswordData(null);
    setIsVerified(false);
  };

  const savePassword = async () => {
    if (!form.site || !form.username || !form.password) {
      toast.error("All fields are required!");
      return;
    }

    if (
      form.site.length <= 3 ||
      form.username.length <= 3 ||
      form.password.length <= 3
    ) {
      toast.error("All fields must be more than 3 characters!");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await passwordAPI.update(
          editingId,
          form.site,
          form.username,
          form.password,
        );
        toast.success("Password updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
        setEditingId(null);
      } else {
        if (!isPremium && passwordArray.length >= MAX_PASSWORDS) {
          setShowUpgradeDialog(true);
          return;
        }
        await passwordAPI.create(form.site, form.username, form.password);
        toast.success("Password saved successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      }

      setForm({ site: "", username: "", password: "" });
      await fetchPasswords();
    } catch (error) {
      if (
        !isPremium &&
        typeof error?.message === "string" &&
        error.message.toLowerCase().includes("maximum limit reached")
      ) {
        setShowUpgradeDialog(true);
      }
      toast.error(error.message || "Failed to save password!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setUpgradeLoading(true);
      const response = await authAPI.upgrade();
      if (response?.user) {
        setUser(response.user);
        setCurrentUser(response.user);
      }
      toast.success(response?.message || "Premium unlocked!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      setShowUpgradeDialog(false);
    } catch (error) {
      toast.error(error.message || "Payment failed!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const deletePassword = async (id) => {
    if (!confirm("Are you sure you want to delete this password?")) {
      return;
    }

    try {
      setLoading(true);
      await passwordAPI.delete(id);
      toast.success("Password deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
      await fetchPasswords();
    } catch (error) {
      toast.error(error.message || "Failed to delete password!");
    } finally {
      setLoading(false);
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    if (passwordToEdit) {
      setForm({
        site: passwordToEdit.site,
        username: passwordToEdit.username,
        password: passwordToEdit.password,
      });
      setEditingId(id);

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleChange = (e) => {
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

      {showUpgradeDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md transform transition-all animate-fadeIn">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowUpgradeDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={upgradeLoading}
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            <img
              src={bkashNagad}
              alt="Payment"
              className="w-full max-w-[280px] mx-auto mb-6"
            />

            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Free limit reached
            </h2>
            <p className="text-gray-600 text-center mb-6">
              আপনি ফ্রি হিসেবে সর্বোচ্চ {MAX_PASSWORDS}টি password save করতে
              পারবেন। Unlimited password add করতে <b>Continue Payment</b> করুন।
            </p>

            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-bold transition-colors"
            >
              {upgradeLoading ? "Processing..." : "Continue Payment"}
            </button>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isVerified ? "Password Details" : "Enter Login Password"}
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
                  Enter your login password to view this saved password.
                </p>

                <input
                  type="password"
                  value={dialogPassword}
                  onChange={(e) => setDialogPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleDialogSubmit()}
                  placeholder="Enter your login password"
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
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                      Site
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={currentPasswordData?.site}
                        target="_blank"
                        rel="noopener noreferrer"
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
            onChange={handleChange}
            placeholder="Enter Website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            name="site"
            id="site"
            disabled={loading}
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              name="username"
              id="username"
              disabled={loading}
            />
            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1 bg-white text-black pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                type={showFormPassword ? "text" : "password"}
                name="password"
                id="password"
                disabled={loading}
              />

              <button
                onClick={toggleFormPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                type="button"
              >
                {showFormPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={savePassword}
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 disabled:bg-green-200 disabled:cursor-not-allowed rounded-full px-8 py-2 w-fit border border-green-900 transition-colors"
          >
            <Save size={20} />
            {editingId ? "Update" : "Save"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({ site: "", username: "", password: "" });
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Cancel Edit
            </button>
          )}

          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              Saved Passwords:{" "}
              <span className="text-green-600">{passwordArray.length}</span> /{" "}
              <span className="text-gray-500">
                {isPremium ? "Unlimited" : MAX_PASSWORDS}
              </span>
            </p>
            {!isPremium && passwordArray.length >= MAX_PASSWORDS && (
              <p className="text-xs text-red-600 mt-1">
                Maximum limit reached! Continue payment to add unlimited.
              </p>
            )}
          </div>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {loading && passwordArray.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Loading passwords...
            </div>
          ) : passwordArray.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No passwords saved yet
            </div>
          ) : (
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
                {passwordArray.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={item.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {item.site}
                          </a>

                          <button
                            onClick={() => copyText(item.site)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                            title="Copy site"
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
                            title="Copy username"
                          >
                            <Copy size={18} className="text-green-700" />
                          </button>
                        </div>
                      </td>
                      <td className="p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>{maskPassword(item.password)}</span>

                          <button
                            onClick={() => handleShowSavedPassword(item)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                            title="View password"
                          >
                            <Eye size={18} className="text-green-700" />
                          </button>
                        </div>
                      </td>
                      <td className="justify-center p-2 border border-white text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => editPassword(item.id)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                            title="Edit password"
                            disabled={loading}
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => deletePassword(item.id)}
                            className="cursor-pointer hover:bg-green-200 p-1 rounded transition-colors"
                            title="Delete password"
                            disabled={loading}
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

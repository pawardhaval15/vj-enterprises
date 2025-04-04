import Graph from "@/components/Graph";
import Sidebar from "@/components/sidebar";
import React from "react";
import { FaPaypal, FaCreditCard, FaUser } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <div className="fixed h-full">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">My Cards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg overflow-hidden bg-blue-600 text-white p-6 relative">
              <div className="flex justify-between mb-6">
                <span className="text-sm opacity-80">Balance</span>
                <div className="opacity-60">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <rect
                      x="7"
                      y="9"
                      width="14"
                      height="2"
                      rx="1"
                      fill="white"
                    />
                    <rect
                      x="7"
                      y="13"
                      width="10"
                      height="2"
                      rx="1"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-8">$5,756</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-80 mb-1">CARD HOLDER</p>
                  <p>Eddy Cusuma</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 mb-1">VALID THRU</p>
                  <p>12/22</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm sm:text-lg tracking-widest">
                  3778 **** **** 1234
                </p>
                <div className="flex space-x-1">
                  <div className="h-6 w-6 rounded-full bg-white opacity-60"></div>
                  <div className="h-6 w-6 rounded-full bg-white opacity-80"></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden bg-white border border-gray-200 p-6 relative">
              <div className="flex justify-between mb-6">
                <span className="text-sm text-gray-500">Balance</span>
                <div className="text-gray-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <rect
                      x="7"
                      y="9"
                      width="14"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                    <rect
                      x="7"
                      y="13"
                      width="10"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">$3,200</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500 mb-1">CARD HOLDER</p>
                  <p className="text-gray-700">Jane Doe</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">VALID THRU</p>
                  <p className="text-gray-700">01/24</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm sm:text-lg tracking-widest text-gray-700">
                  1234 **** **** 5678
                </p>
                <div className="flex space-x-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                  <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                </div>
              </div>
            </div>
            <div className="mb-0">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Recent Transactions
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <FaCreditCard className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Deposit from my Card
                      </p>
                      <p className="text-sm text-gray-500">25 January 2021</p>
                    </div>
                  </div>
                  <span className="text-red-500">- $500</span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <FaPaypal className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Deposit Paypal
                      </p>
                      <p className="text-sm text-gray-500">25 January 2021</p>
                    </div>
                  </div>
                  <span className="text-green-500">+ $500</span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                      <FaUser className="text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Jemi Wilson</p>
                      <p className="text-sm text-gray-500">25 January 2021</p>
                    </div>
                  </div>
                  <span className="text-green-500">+ $500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Graph />
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Expense Statistics
              </h2>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-52 h-52">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-sm"
                >
                  {/* Entertainment - Blue */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="1.5"
                    transform="rotate(-90 50 50)"
                    strokeDasharray="75.4 251.2"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Bills - Pink */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="#ec4899"
                    stroke="white"
                    strokeWidth="1.5"
                    transform="rotate(0 50 50)"
                    strokeDasharray="62.8 251.2"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Investment - Dark Blue */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="#1e40af"
                    stroke="white"
                    strokeWidth="1.5"
                    transform="rotate(90 50 50)"
                    strokeDasharray="62.8 251.2"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Others - Orange */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="#f97316"
                    stroke="white"
                    strokeWidth="1.5"
                    transform="rotate(180 50 50)"
                    strokeDasharray="50.24 251.2"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Center white circle for donut effect */}
                  <circle cx="50" cy="50" r="25" fill="white" />
                  {/* Total text in center */}
                  <text
                    x="50"
                    y="45"
                    textAnchor="middle"
                    fill="#374151"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    TOTAL
                  </text>
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fill="#374151"
                    fontSize="6"
                  >
                    $12,450
                  </text>
                </svg>
              </div>
              <div className="ml-6">
                <div className="text-sm font-medium space-y-4">
                  <div className="flex items-center group transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 group-hover:scale-110 transition-all"></div>
                    <div>
                      <span className="text-sm text-gray-800 font-medium">
                        Entertainment
                      </span>
                      <p className="text-xs text-gray-500">30% ($3,735)</p>
                    </div>
                  </div>
                  <div className="flex items-center group transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-pink-500 rounded-full mr-3 group-hover:scale-110 transition-all"></div>
                    <div>
                      <span className="text-sm text-gray-800 font-medium">
                        Bills
                      </span>
                      <p className="text-xs text-gray-500">25% ($3,112)</p>
                    </div>
                  </div>
                  <div className="flex items-center group transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-blue-800 rounded-full mr-3 group-hover:scale-110 transition-all"></div>
                    <div>
                      <span className="text-sm text-gray-800 font-medium">
                        Investment
                      </span>
                      <p className="text-xs text-gray-500">25% ($3,112)</p>
                    </div>
                  </div>
                  <div className="flex items-center group transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-3 group-hover:scale-110 transition-all"></div>
                    <div>
                      <span className="text-sm text-gray-800 font-medium">
                        Others
                      </span>
                      <p className="text-xs text-gray-500">20% ($2,491)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Quick Transfer
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient
                </label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3">
                  <option>Select recipient</option>
                  <option>Jane Doe</option>
                  <option>John Smith</option>
                  <option>Jemi Wilson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  placeholder="$0.00"
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>
              <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-md">
                Transfer Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Balance History
            </h2>

            <div className="space-y-3">
              {[
                { month: "January", balance: "$4,200", change: "+2.3%" },
                { month: "February", balance: "$3,800", change: "-9.5%" },
                { month: "March", balance: "$4,500", change: "+18.4%" },
                { month: "April", balance: "$5,756", change: "+27.9%" },
              ].map((item) => (
                <div
                  key={item.month}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <span className="text-gray-600">{item.month}</span>
                  <div className="text-right">
                    <div className="font-medium">{item.balance}</div>
                    <div
                      className={`text-xs ${
                        item.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

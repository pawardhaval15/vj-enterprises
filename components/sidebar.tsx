"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Package,
  Users,
  LogOut,
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Billing",
      href: "/billing",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Quotation",
      href: "/quotation",
      icon: <FileText size={20} />,
    },
    {
      name: "Products",
      href: "/products",
      icon: <Package size={20} />,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: <Users size={20} />,
    },
    {
      name: "Logout",
      href: "/login",
      icon: <LogOut size={20} />,
    },
  ];

  return (
    <aside className={`bg-white text-black w-64 min-h-screen p-4 ${className}`}>
      <div className="flex items-center justify-center mb-8 mt-2">
        <span className="text-2xl font-bold">MyApp</span>
      </div>

      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      isActive ? "bg-gray-900 text-white" : "text-black-300"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 p-4 w-64">
        <div className="flex items-center space-x-3 py-3 px-4">
          <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-400">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import { cn } from "@/lib/utils";
import { Database, FileText, Package, PackagePlus, Settings2 } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
            active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="hidden w-64 flex-col border-r bg-sidebar p-4 md:flex">
                <div className="mb-8 flex items-center">
                    <span className="text-2xl font-bold text-clinic-primary">MedStock</span>
                </div>

                <nav className="space-y-1">
                    <NavItem
                        to="/"
                        icon={<Package className="h-5 w-5" />}
                        label="Estoque"
                        active={currentPath === "/"}
                    />
                    <NavItem
                        to="/add-product"
                        icon={<PackagePlus className="h-5 w-5" />}
                        label="Adicionar Produto"
                        active={currentPath === "/add-product"}
                    />
                    <NavItem
                        to="/reports"
                        icon={<FileText className="h-5 w-5" />}
                        label="Relatórios"
                        active={currentPath === "/reports"}
                    />
                    <NavItem
                        to="/movements"
                        icon={<Database className="h-5 w-5" />}
                        label="Movimentações"
                        active={currentPath === "/movements"}
                    />
                    <NavItem
                        to="/utils"
                        icon={<Settings2 className="h-5 w-5" />}
                        label="Utilitários"
                        active={currentPath === "/utils"}
                    />
                </nav>

                <div className="mt-auto pt-4 text-xs text-muted-foreground">
                    <p>MedStock Clinic Control v1.0</p>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <div className="p-4 md:p-6">{children}</div>
            </div>
        </div>
    );
};

export default Layout;

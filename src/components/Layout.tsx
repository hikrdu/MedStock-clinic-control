import { cn } from "@/lib/utils";
import { ArrowDownUpIcon, FileText, Package, Package2, PackagePlus, Settings2, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
    to?: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (children) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div>
            {children ? (
                <div
                    onClick={handleToggle}
                    className={cn(
                        "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent cursor-pointer",
                        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    {icon}
                    <span>{label}</span>
                </div>
            ) : (
                <Link
                    to={to || "#"}
                    className={cn(
                        "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    {icon}
                    <span>{label}</span>
                </Link>
            )}
            {isOpen && children && (
                <div className="ml-6 mt-2 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
};

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="hidden w-64 flex-col border-r bg-sidebar p-4 md:flex sidebar">
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
                        icon={<FileText className="h-5 w-5" />}
                        label="Relatórios"
                        active={currentPath.startsWith("/reports")}
                    >
                        <NavItem
                            to="/reports/inventory"
                            icon={<Package2 className="h-4 w-4" />}
                            label="Estoque"
                            active={currentPath === "/reports/inventory"}
                        />
                        <NavItem
                            to="/reports/purchases"
                            icon={<ShoppingCart className="h-4 w-4" />}
                            label="Compras"
                            active={currentPath === "/reports/purchases"}
                        />
                    </NavItem>
                    <NavItem
                        to="/movements"
                        icon={<ArrowDownUpIcon className="h-5 w-5" />}
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

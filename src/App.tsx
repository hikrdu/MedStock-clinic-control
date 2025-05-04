import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Index from "./pages/Index";
import MovementsPage from "./pages/MovementsPage";
import NotFound from "./pages/NotFound";
import ReportsPage from "./pages/ReportsPage";
import UtilsPage from "./pages/UtilsPage";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/MedStock-clinic-control">
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/edit-product/:_id" element={<EditProduct />} />
                    <Route path="/reports/:type" element={<ReportsPage />} />
                    <Route path="/movements" element={<MovementsPage />} />
                    <Route path="/utils" element={<UtilsPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;

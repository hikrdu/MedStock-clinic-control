import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useProductCache } from "@/contexts/ProductCacheContext";
import { Download, FileText, Printer } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ReportItem {
    _id: string;
    description: string;
    unit: string;
    quantity: number;
    sector: string;
}

const ReportInventory: React.FC = () => {
    const { products, loading, fetchProducts } = useProductCache();
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [filteredData, setFilteredData] = useState<ReportItem[]>([]);
    const [selectedSector, setSelectedSector] = useState<string>("all");
    const [sectors, setSectors] = useState<string[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setReportData(products);
        setFilteredData(products);

        // Extract unique sectors
        const uniqueSectors = Array.from(new Set(products.map(item => item.sector)));
        setSectors(uniqueSectors);
    }, [products]);

    useEffect(() => {
        if (selectedSector === "all") {
            setFilteredData(reportData);
        } else {
            setFilteredData(reportData.filter(item => item.sector === selectedSector));
        }
    }, [selectedSector, reportData]);

    const handlePrintReport = () => {
        const sidebar = document.querySelector(".sidebar") as HTMLElement | null;
        if (sidebar) {
            sidebar.style.display = "none";
        }
        window.print();
        if (sidebar) {
            sidebar.style.display = "";
        }
    };

    const handleExportCSV = () => {
        // Create CSV content
        const headers = "Descrição,Unidade,Quantidade Atual\n";
        const rows = filteredData.map(item =>
            `"${item.description}","${item.unit}",${item.quantity}`
        ).join("\n");

        const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
        const encodedUri = encodeURI(csvContent);

        // Create download link and trigger download
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `relatorio-compras-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateTotalItems = () => {
        return filteredData.length;
    };

    return (
        <>
            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-clinic-primary">Relatório de Compras</h1>
                    <p className="text-muted-foreground">
                        Produtos no estoque
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={handlePrintReport}
                        className="flex items-center"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExportCSV}
                        className="flex items-center"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Produtos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{calculateTotalItems()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Filtrar por Setor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={selectedSector}
                            onValueChange={setSelectedSector}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todos os setores" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os setores</SelectItem>
                                {sectors.map((sector) => (
                                    <SelectItem key={sector} value={sector}>
                                        {sector}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6 print:shadow-none">
                <CardHeader className="print:pb-0">
                    <CardTitle className="print:text-center print:text-xl">
                        <div className="hidden print:block print:mb-2">MedStock - Clínica de Especialidades Médicas</div>
                        Relatório de Produtos - {new Date().toLocaleDateString('pt-BR')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="text-center">
                                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-clinic-primary"></div>
                                <p className="text-muted-foreground">Gerando relatório...</p>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center">
                            <FileText className="mb-2 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">Nenhum produto</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-2 pt-4 font-medium">Descrição</th>
                                        <th className="pb-2 pt-4 font-medium">Qtd. Atual</th>
                                        <th className="pb-2 pt-4 font-medium">Unidade</th>
                                        <th className="pb-2 pt-4 font-medium">Setor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredData.map((item) => (
                                        <tr key={item._id} className="hover:bg-muted/50">
                                            <td className="py-3">{item.description}</td>
                                            <td className="py-3">{item.quantity}</td>
                                            <td className="py-3">{item.unit}</td>
                                            <td className="py-3">{item.sector}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default ReportInventory;

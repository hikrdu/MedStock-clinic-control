import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ProductStock } from "@/services/api/models/Product";
import { productService } from "@/services/api/productService";
import { Database } from "lucide-react";
import React, { useEffect, useState } from "react";

const StockMovements: React.FC = () => {
    const [stockMovements, setStockMovements] = useState<(ProductStock & { productDescription?: string })[]>([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<{ id: string; description: string }[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("all");

    const { toast } = useToast();

    useEffect(() => {
        fetchProductsAndMovements();
    }, []);

    useEffect(() => {
        filterMovements();
    }, [selectedProduct]);

    const fetchProductsAndMovements = async () => {
        try {
            setLoading(true);
            const productsData = await productService.getProducts();
            const movementsData = await productService.getStockMovements();

            // Extract product info for dropdown
            setProducts(
                productsData.map((product) => ({
                    id: product._id,
                    description: product.description,
                }))
            );

            // Combine movements with product descriptions
            const enhancedMovements = movementsData.map((movement) => {
                const product = productsData.find((p) => p._id === movement.productId);
                return {
                    ...movement,
                    productDescription: product?.description || "Produto Desconhecido",
                };
            });

            setStockMovements(enhancedMovements);
        } catch (error) {
            console.error("Failed to fetch stock movements:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as movimentações de estoque.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filterMovements = async () => {
        try {
            setLoading(true);
            let movements;

            if (selectedProduct === "all") {
                movements = await productService.getStockMovements();
            } else {
                movements = await productService.getStockMovements(selectedProduct);
            }

            // Enhance movements with product descriptions
            const enhancedMovements = await Promise.all(
                movements.map(async (movement) => {
                    const product = products.find((p) => p.id === movement.productId);
                    return {
                        ...movement,
                        productDescription: product?.description || "Produto Desconhecido",
                    };
                })
            );

            setStockMovements(enhancedMovements);
        } catch (error) {
            console.error("Failed to filter movements:", error);
            toast({
                title: "Erro",
                description: "Não foi possível filtrar as movimentações.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-clinic-primary">Movimentações de Estoque</h1>
                <p className="text-muted-foreground">
                    Histórico de entradas e saídas de produtos
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Filtrar por Produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos os produtos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os produtos</SelectItem>
                            {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                    {product.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="text-center">
                                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-clinic-primary"></div>
                                <p className="text-muted-foreground">Carregando movimentações...</p>
                            </div>
                        </div>
                    ) : stockMovements.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center">
                            <Database className="mb-2 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">Nenhuma movimentação encontrada</p>
                            <p className="text-muted-foreground">
                                Não há registros de movimentação para este produto
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-2 pt-4 font-medium">Data</th>
                                        <th className="pb-2 pt-4 font-medium">Produto</th>
                                        <th className="pb-2 pt-4 font-medium">Tipo</th>
                                        <th className="pb-2 pt-4 font-medium">Quantidade</th>
                                        <th className="pb-2 pt-4 font-medium">Observações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {stockMovements.map((movement) => (
                                        <tr key={movement._id} className="hover:bg-muted/50">
                                            <td className="py-3">{formatDate(movement.date)}</td>
                                            <td className="py-3">{movement.productDescription}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${movement.type === "IN"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {movement.type === "IN" ? "Entrada" : "Saída"}
                                                </span>
                                            </td>
                                            <td className="py-3">{movement.quantity}</td>
                                            <td className="py-3">{movement.notes || "-"}</td>
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

export default StockMovements;

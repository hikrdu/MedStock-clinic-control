import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/services/api/models/Product";
import { productService } from "@/services/api/productService";
import { Edit, Package, Plus, Search, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [stockType, setStockType] = useState<"IN" | "OUT">("IN");
    const [stockNotes, setStockNotes] = useState("");

    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(
                (product) =>
                    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.sector.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os produtos.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        navigate("/add-product");
    };

    const handleEditProduct = (product: Product) => {
        navigate(`/edit-product/${product._id}`);
    };

    const handleDeleteProduct = async (_id: string) => {
        try {
            const success = await productService.deleteProduct(_id);
            if (success) {
                toast({
                    title: "Sucesso",
                    description: "Produto removido com sucesso.",
                });
                fetchProducts();
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast({
                title: "Erro",
                description: "Não foi possível remover o produto.",
                variant: "destructive",
            });
        }
    };

    const handleAddStock = (product: Product) => {
        setSelectedProduct(product);
        setStockQuantity(0);
        setStockType("IN");
        setStockNotes("");
        setStockDialogOpen(true);
    };

    const handleSubmitStockChange = async () => {
        if (!selectedProduct || stockQuantity <= 0) {
            toast({
                title: "Erro",
                description: "Por favor, insira uma quantidade válida.",
                variant: "destructive",
            });
            return;
        }

        try {
            await productService.addStockMovement({
                productId: selectedProduct._id,
                type: stockType,
                quantity: stockQuantity,
                date: new Date(),
                notes: stockNotes,
            });

            toast({
                title: "Sucesso",
                description: `${stockType === "IN" ? "Entrada" : "Saída"} registrada com sucesso.`,
            });
            setStockDialogOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Failed to add stock movement:", error);
            toast({
                title: "Erro",
                description: "Não foi possível registrar a movimentação.",
                variant: "destructive",
            });
        }
    };

    const formatDate = (date?: Date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("pt-BR");
    };

    return (
        <>
            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-clinic-primary">Estoque de Produtos</h1>
                    <p className="text-muted-foreground">
                        Gerencie o estoque de produtos da clínica
                    </p>
                </div>
                <Button onClick={handleAddProduct} className="bg-clinic-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Buscar Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por descrição ou setor..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="text-center">
                                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-clinic-primary"></div>
                                <p className="text-muted-foreground">Carregando produtos...</p>
                            </div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center">
                            <Package className="mb-2 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">Nenhum produto encontrado</p>
                            <p className="text-muted-foreground">
                                {searchTerm ? "Tente outro termo de busca" : "Adicione produtos ao estoque"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Estoque</TableHead>
                                        <TableHead>Validade</TableHead>
                                        <TableHead>Setor</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell className="font-medium">{product.description}</TableCell>
                                            <TableCell>
                                                {product.quantity} {product.unit}{" "}
                                                <span
                                                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${product.quantity < product.monthlyIdealQuantity / 2
                                                        ? "bg-red-100 text-red-800"
                                                        : product.quantity < product.monthlyIdealQuantity
                                                            ? "bg-amber-100 text-amber-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {product.quantity < product.monthlyIdealQuantity / 2
                                                        ? "Crítico"
                                                        : product.quantity < product.monthlyIdealQuantity
                                                            ? "Baixo"
                                                            : "OK"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatDate(product.expirationDate)}</TableCell>
                                            <TableCell>{product.sector}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mr-2"
                                                    onClick={() => handleAddStock(product)}
                                                >
                                                    <Plus className="mr-1 h-3.5 w-3.5" />
                                                    Mov.
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mr-2"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                >
                                                    <Trash className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Movimentação de Estoque</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Produto:</p>
                            <p>{selectedProduct?.description}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-1 items-center space-x-2">
                                <input
                                    type="radio"
                                    id="stock-in"
                                    name="stock-type"
                                    checked={stockType === "IN"}
                                    onChange={() => setStockType("IN")}
                                    className="h-4 w-4 rounded border-gray-300 text-clinic-primary focus:ring-clinic-primary"
                                />
                                <label htmlFor="stock-in" className="text-sm font-medium">
                                    Entrada
                                </label>
                            </div>
                            <div className="flex flex-1 items-center space-x-2">
                                <input
                                    type="radio"
                                    id="stock-out"
                                    name="stock-type"
                                    checked={stockType === "OUT"}
                                    onChange={() => setStockType("OUT")}
                                    className="h-4 w-4 rounded border-gray-300 text-clinic-primary focus:ring-clinic-primary"
                                />
                                <label htmlFor="stock-out" className="text-sm font-medium">
                                    Saída
                                </label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium">
                                Quantidade:
                            </label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-sm font-medium">
                                Observações:
                            </label>
                            <Input
                                id="notes"
                                value={stockNotes}
                                onChange={(e) => setStockNotes(e.target.value)}
                                placeholder="Observações sobre a movimentação"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStockDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmitStockChange} className="bg-clinic-primary">
                            {stockType === "IN" ? "Registrar Entrada" : "Registrar Saída"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProductList;

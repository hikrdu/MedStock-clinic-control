import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { productService } from "@/services/api/productService";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm: React.FC = () => {
    const { _id } = useParams<{ _id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = !!_id;

    const [formData, setFormData] = useState<{
        description: string;
        unit: string;
        quantity: number;
        expirationDate: string;
        monthlyIdealQuantity: number;
        sector: string;
    }>({
        description: "",
        unit: "un",
        quantity: 0,
        expirationDate: "",
        monthlyIdealQuantity: 0,
        sector: "",
    });

    const [loading, setLoading] = useState(false);
    const [fetchingProduct, setFetchingProduct] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [_id]);

    const fetchProduct = async () => {
        try {
            setFetchingProduct(true);
            const product = await productService.getProductById(_id!);
            if (product) {
                setFormData({
                    description: product.description,
                    unit: product.unit,
                    quantity: product.quantity,
                    expirationDate: product.expirationDate
                        ? new Date(product.expirationDate).toISOString().substring(0, 10)
                        : "",
                    monthlyIdealQuantity: product.monthlyIdealQuantity,
                    sector: product.sector,
                });
            } else {
                toast({
                    title: "Erro",
                    description: "Produto não encontrado.",
                    variant: "destructive",
                });
                navigate("/");
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os dados do produto.",
                variant: "destructive",
            });
            navigate("/");
        } finally {
            setFetchingProduct(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value ? parseFloat(value) : 0) : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.description.trim() === "") {
            toast({
                title: "Erro",
                description: "A descrição do produto é obrigatória.",
                variant: "destructive",
            });
            return;
        }

        if (formData.sector.trim() === "") {
            toast({
                title: "Erro",
                description: "O setor é obrigatório.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            // Format data for API
            const productData = {
                description: formData.description,
                unit: formData.unit,
                quantity: formData.quantity,
                expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
                monthlyIdealQuantity: formData.monthlyIdealQuantity,
                sector: formData.sector,
            };

            if (isEditing) {
                await productService.updateProduct(_id!, productData);
                toast({
                    title: "Sucesso",
                    description: "Produto atualizado com sucesso.",
                });
            } else {
                await productService.createProduct(productData);
                toast({
                    title: "Sucesso",
                    description: "Produto adicionado com sucesso.",
                });
            }

            setFormData({
                description: "",
                unit: "",
                quantity: 0,
                expirationDate: "",
                monthlyIdealQuantity: 0,
                sector: "",
            });

            // navigate("/");
        } catch (error) {
            console.error("Failed to save product:", error);
            toast({
                title: "Erro",
                description: `Não foi possível ${isEditing ? "atualizar" : "adicionar"} o produto.`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProduct) {
        return (
            <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                    <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-clinic-primary"></div>
                    <p className="text-muted-foreground">Carregando dados do produto...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-clinic-primary">
                    {isEditing ? "Editar Produto" : "Adicionar Produto"}
                </h1>
                <p className="text-muted-foreground">
                    {isEditing
                        ? "Atualize as informações do produto existente"
                        : "Preencha os dados para adicionar um novo produto ao estoque"}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Formulário de Edição" : "Formulário de Cadastro"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Nome do produto"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Unidade de Medida</Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value) => handleSelectChange("unit", value)}
                                >
                                    <SelectTrigger id="unit">
                                        <SelectValue placeholder="Selecione a unidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bl">Bloco (bl)</SelectItem>
                                        <SelectItem value="cx">Caixa (cx)</SelectItem>
                                        <SelectItem value="fd">Fardo (fd)</SelectItem>
                                        <SelectItem value="pct">Pacote (pct)</SelectItem>
                                        <SelectItem value="rl">Rolo (rl)</SelectItem>
                                        <SelectItem value="sg">Seringa (sg)</SelectItem>
                                        <SelectItem value="un">Unidade (un)</SelectItem>
                                        <SelectItem value="sd">Sob Demanda (sd)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantidade Atual</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monthlyIdealQuantity">Quantidade Ideal Mensal</Label>
                                <Input
                                    id="monthlyIdealQuantity"
                                    name="monthlyIdealQuantity"
                                    type="number"
                                    min="0"
                                    value={formData.monthlyIdealQuantity}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expirationDate">Data de Validade</Label>
                                <Input
                                    id="expirationDate"
                                    name="expirationDate"
                                    // type="date"
                                    value={formData.expirationDate}
                                    onChange={handleChange}
                                    placeholder="mm/aaaa"
                                    pattern="\d{2}/\d{4}"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sector">Setor</Label>
                                <Select
                                    value={formData.sector}
                                    onValueChange={(value) => handleSelectChange("sector", value)}
                                >
                                    <SelectTrigger id="sector">
                                        <SelectValue placeholder="Selecione o setor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Área Médica">Área Médica</SelectItem>
                                        <SelectItem value="Cozinha">Cozinha</SelectItem>
                                        <SelectItem value="Escritório">Escritório</SelectItem>
                                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                                        <SelectItem value="Odontologia">Odontologia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/")}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-clinic-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-current"></div>
                                        Salvando...
                                    </>
                                ) : isEditing ? (
                                    "Atualizar Produto"
                                ) : (
                                    "Adicionar Produto"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
};

export default ProductForm;

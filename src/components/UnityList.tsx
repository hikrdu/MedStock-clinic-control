import { Unity } from "@/services/api/models/Utis";
import { utilService } from "@/services/api/utilService";
import { Plus, ScaleIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useToast } from "./ui/use-toast";

const UnityList: React.FC = () => {
    const [unitys, setUnitys] = useState<Unity[]>([]);
    const [loading, setLoading] = useState(true);
    const [unityDialogOpen, setUnityDialogOpen] = useState(false);
    const [unityData, setFormData] = useState<{
        description: string;
        abreviation: string;
    }>({
        description: "",
        abreviation: "",
    });
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitUnityChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (unityData.description.trim() === "") {
            toast({
                title: "Erro",
                description: "A descrição da unidade é obrigatória.",
                variant: "destructive",
            });
            return;
        }
        if (unityData.abreviation.trim() === "") {
            toast({
                title: "Erro",
                description: "A abreviação da unidade é obrigatória.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            // Format data for API
            const formData = {
                description: unityData.description,
                abreviation: unityData.abreviation,

            };


            await utilService.createUnity(formData);
            toast({
                title: "Sucesso",
                description: "Unidade adicionada com sucesso.",
            });


            setFormData({
                description: "",
                abreviation: "",
            });
            await fetchUnitys();

            // navigate("/");
        } catch (error) {
            console.error("Failed to save unity:", error);
            toast({
                title: "Erro",
                description: `Não foi possível adicionar a unidade.`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    const { toast } = useToast();

    useEffect(() => {
        fetchUnitys();
    }, []);

    const fetchUnitys = async () => {
        try {
            setLoading(true);
            const data = await utilService.getUnities();
            setUnitys(data);
        } catch (error) {
            console.error("Failed to fetch Unitys:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as unidades.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnity = () => {
        setUnityDialogOpen(true);
    };

    const handleDeleteUnity = async (_id: string) => {
        try {
            const success = await utilService.removeUnity(_id);
            if (success) {
                toast({
                    title: "Sucesso",
                    description: "Unidade removida com sucesso.",
                });
                fetchUnitys();
            }
        } catch (error) {
            console.error("Failed to delete Unity:", error);
            toast({
                title: "Erro",
                description: "Não foi possível remover a unidade.",
                variant: "destructive",
            });
        }
    };
    return (
        <>
            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-xl font-bold text-clinic-primary">Unidades cadastradas</h1>
                    <p className="text-muted-foreground">
                        Gerencie as unidades de medida dos produtos
                    </p>
                </div>
                <Button onClick={handleAddUnity} className="bg-clinic-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Unidade
                </Button>
            </div>
            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="text-center">
                                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-clinic-primary"></div>
                                <p className="text-muted-foreground">Carregando unidades...</p>
                            </div>
                        </div>
                    ) : unitys.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center">
                            <ScaleIcon className="mb-2 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">Nenhuma unidade cadastrada</p>

                        </div>) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Unidade</TableHead>

                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {unitys.map((Unity) => (
                                        <TableRow key={Unity._id}>
                                            <TableCell className="font-medium">{Unity.description}</TableCell>
                                            <TableCell>
                                                {Unity.description}

                                            </TableCell>
                                            <TableCell>
                                                {Unity.abreviation}

                                            </TableCell>

                                            <TableCell className="text-right">


                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => handleDeleteUnity(Unity._id)}
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

            <Dialog open={unityDialogOpen} onOpenChange={setUnityDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Unidade</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                Preencha os dados para adicionar um nova Unidade.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                name="description"
                                value={unityData.description}
                                onChange={handleChange}
                                placeholder="Descrição da unidade"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="abreviation">Unidade Abreviada</Label>
                            <Input
                                id="abreviation"
                                name="abreviation"
                                value={unityData.abreviation}
                                onChange={handleChange}
                                placeholder="Ex. UN"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={
                                () => {
                                    setFormData({
                                        description: "",
                                        abreviation: "",
                                    }),
                                        setUnityDialogOpen(false)
                                }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmitUnityChange} className="bg-clinic-primary">
                            Registrar Unidade
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default UnityList;

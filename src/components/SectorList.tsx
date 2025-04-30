import { Sector } from "@/services/api/models/Utis";
import { utilService } from "@/services/api/utilService";
import { LayoutDashboard, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useToast } from "./ui/use-toast";

const SectorList: React.FC = () => {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectorDialogOpen, setSectorDialogOpen] = useState(false);
    const [sectorData, setFormData] = useState<{
        description: string;
    }>({
        description: "",
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

    const handleSubmitSectorChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (sectorData.description.trim() === "") {
            toast({
                title: "Erro",
                description: "A descrição do setor é obrigatória.",
                variant: "destructive",
            });
            return;
        }



        try {
            setLoading(true);

            // Format data for API
            const formData = {
                description: sectorData.description,

            };

            await utilService.createSector(formData);
            toast({
                title: "Sucesso",
                description: "Unidade adicionada com sucesso.",
            });


            setFormData({
                description: "",
            });

            //setSectorDialogOpen(false);
            await fetchSectors();

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
        fetchSectors();
    }, []);

    const fetchSectors = async () => {
        try {
            setLoading(true);
            const data = await utilService.getSectors();
            setSectors(data);
        } catch (error) {
            console.error("Failed to fetch sectors:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os setores.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddSector = () => {
        setSectorDialogOpen(true);
    };

    const handleDeleteSector = async (_id: string) => {
        try {
            const success = await utilService.removeSector(_id);
            if (success) {
                toast({
                    title: "Sucesso",
                    description: "Setor removido com sucesso.",
                });
                fetchSectors();
            }
        } catch (error) {
            console.error("Failed to delete Sector:", error);
            toast({
                title: "Erro",
                description: "Não foi possível remover o setor.",
                variant: "destructive",
            });
        }
    };
    return (
        <>
            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-xl font-bold text-clinic-primary">Setores cadastrados</h1>
                    <p className="text-muted-foreground">
                        Gerencie os setores da clínica
                    </p>
                </div>
                <Button onClick={handleAddSector} className="bg-clinic-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Setor
                </Button>
            </div>
            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="text-center">
                                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-clinic-primary"></div>
                                <p className="text-muted-foreground">Carregando setores...</p>
                            </div>
                        </div>
                    ) : sectors.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center">
                            <LayoutDashboard className="mb-2 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">Nenhum setor cadastrado</p>

                        </div>) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>

                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sectors.map((sector) => (
                                        <TableRow key={sector._id}>
                                            <TableCell className="font-medium">{sector.description}</TableCell>
                                            <TableCell>
                                                {sector.description}

                                            </TableCell>

                                            <TableCell className="text-right">


                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => handleDeleteSector(sector._id)}
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

            <Dialog open={sectorDialogOpen} onOpenChange={setSectorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Setor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                Preencha os dados para adicionar um novo Setor.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                name="description"
                                value={sectorData.description}
                                onChange={handleChange}
                                placeholder="Descrição da unidade"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    description: "",
                                }),
                                    setSectorDialogOpen(false)
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmitSectorChange} className="bg-clinic-primary">
                            Registrar Setor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default SectorList;

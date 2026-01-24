'use client';

import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter, useParams } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { UPDATE_INVENTORY, CREATE_OR_UPDATE_BUILDING_DETAILS, CREATE_MULTIPLE_INVENTORY_ITEMS, DELETE_INVENTORY } from "@/services/mutation"
import { GET_INVENTORY_BY_ID, GET_ALL_CHURCH } from "@/services/query"
import { toast } from "sonner"
import { Loader } from "@/components/loader"

const ACCESORIO_ITEMS = [
  'Púlpito', 'Biblia', 'Himnario', 'Campanilla', 'Paños Púlpito', 'Alfombra',
  'Sillas', 'Micrófono', 'Pintura (Cuadro)', 'Sillones', 'Mesas', 'Parlantes',
  'Manteles', 'Paños Mesa', 'Diario Mural', 'Cortinas', 'Limpia Pie', 'Floreros',
  'Jarrones', 'Bancas', 'Letrero Identificación', 'Ofrenderos', 'Instrumentos',
  'Megáfono', 'Aspiradora', 'Enceradora', 'Atriles', 'Pedestales', 'Mesones',
  'Ventiladores', 'Pizarrón', 'Lámparas', 'Vasos', 'Vasos Santa Cena',
  'Jarro Vino Sta. Cena', 'Bandejas', 'Teteras', 'Fondos', 'Cocina',
  'Balón de Gas', 'Lavaplatos', 'Ollas', 'Mueble de Cocina', 'Cubiertos',
  'Vajillas', 'Thermo', 'Estufa', 'Lavamano', 'Inhodoro', 'Ducha'
];

const VAJILLA_ITEMS = [
  'Tazas', 'Plato de taza', 'Platos de pan', 'Platos bajo', 'Platos hondos',
  'Posillos postre', 'Panera', 'Servilleteras', 'Manteles', 'Ensaladera',
  'Vasos', 'Cuchara grande', 'Cuchara Chica', 'Tenedor', 'Cuchillo'
];

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState('identification');
  const [churches, setChurches] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [inventoryData, setInventoryData] = useState({
    churchId: '',
    year: new Date().getFullYear(),
    date: new Date().toISOString().split('T')[0],
    observations: '',
  });

  const [buildingData, setBuildingData] = useState({
    propertyArea: '',
    builtArea: '',
    wallTypes: [] as string[],
    floorTypes: [] as string[],
    ceilingTypes: [] as string[],
    roofCovering: [] as string[],
    propertyEnclosure: [] as string[],
    numberOfDoors: '',
    numberOfWindows: '',
    electricalEnergy: '',
    electricalEnergyOther: '',
    water: '',
    waterOther: '',
    bathroomDetails: '',
    diningRoomDetails: '',
  });

  const [accesorioItems, setAccesorioItems] = useState<Record<string, { hasItem: boolean; quantity: string }>>({});
  const [vajillaItems, setVajillaItems] = useState<Record<string, { quantity: string }>>({});

  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (churchesData) {
      setChurches((churchesData as any)?.Church?.getAll || []);
    }
  }, [churchesData]);

  const [getInventory, { loading: loadingInventory, error: inventoryError, data: inventoryQueryData }] = useLazyQuery(GET_INVENTORY_BY_ID, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  });

  // Usar useEffect para procesar los datos cuando lleguen
  useEffect(() => {
    if (inventoryQueryData) {
      const inventory = (inventoryQueryData as any)?.Inventory?.getById;
      if (inventory) {
        // Establecer datos del inventario
        const newInventoryData = {
          churchId: inventory.churchId?.toString() || '',
          year: inventory.year || new Date().getFullYear(),
          date: inventory.date ? inventory.date.split('T')[0] : new Date().toISOString().split('T')[0],
          observations: inventory.observations || '',
        };
        setInventoryData(newInventoryData);

        if (inventory.buildingDetails) {
          const bd = inventory.buildingDetails;
          
          // Parsear arrays de forma segura
          const parseJsonArray = (value: any): string[] => {
            if (!value) return [];
            if (typeof value === 'string') {
              try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                return [];
              }
            }
            return Array.isArray(value) ? value : [];
          };

          const newBuildingData = {
            propertyArea: bd.propertyArea?.toString() || '',
            builtArea: bd.builtArea?.toString() || '',
            wallTypes: parseJsonArray(bd.wallTypes),
            floorTypes: parseJsonArray(bd.floorTypes),
            ceilingTypes: parseJsonArray(bd.ceilingTypes),
            roofCovering: parseJsonArray(bd.roofCovering),
            propertyEnclosure: parseJsonArray(bd.propertyEnclosure),
            numberOfDoors: bd.numberOfDoors?.toString() || '',
            numberOfWindows: bd.numberOfWindows?.toString() || '',
            electricalEnergy: bd.electricalEnergy || '',
            electricalEnergyOther: bd.electricalEnergyOther || '',
            water: bd.water || '',
            waterOther: bd.waterOther || '',
            bathroomDetails: bd.bathroomDetails || '',
            diningRoomDetails: bd.diningRoomDetails || '',
          };
          
          setBuildingData(newBuildingData);
        } else {
        }

        // Cargar items
        if (inventory.items && Array.isArray(inventory.items) && inventory.items.length > 0) {
          const accesorios: Record<string, { hasItem: boolean; quantity: string }> = {};
          const vajilla: Record<string, { quantity: string }> = {};

          // Primero inicializar todos los items de las listas constantes con valores vacíos
          ACCESORIO_ITEMS.forEach(item => {
            accesorios[item] = { hasItem: false, quantity: '' };
          });
          VAJILLA_ITEMS.forEach(item => {
            vajilla[item] = { quantity: '' };
          });

          // Luego cargar los valores de la base de datos (sobrescribir los valores vacíos)
          inventory.items.forEach((item: any) => {
            if (item.category === 'ACCESORIO') {
              accesorios[item.itemName] = {
                hasItem: item.hasItem === true || item.hasItem === 'true' || item.hasItem === 1,
                quantity: item.quantity !== null && item.quantity !== undefined ? item.quantity.toString() : '',
              };
            } else if (item.category === 'VAJILLA_Y_CUBIERTOS') {
              vajilla[item.itemName] = {
                quantity: item.quantity !== null && item.quantity !== undefined ? item.quantity.toString() : '',
              };
            }
          });

          setAccesorioItems(accesorios);
          setVajillaItems(vajilla);
        } else {
          const initialAccesorios: Record<string, { hasItem: boolean; quantity: string }> = {};
          const initialVajilla: Record<string, { quantity: string }> = {};
          ACCESORIO_ITEMS.forEach(item => {
            initialAccesorios[item] = { hasItem: false, quantity: '' };
          });
          VAJILLA_ITEMS.forEach(item => {
            initialVajilla[item] = { quantity: '' };
          });
          setAccesorioItems(initialAccesorios);
          setVajillaItems(initialVajilla);
        }
        
        // Establecer loadingData en false DESPUÉS de establecer todos los datos
        setLoadingData(false);
      } else {
        setLoadingData(false);
      }
    }
  }, [inventoryQueryData]);

  // Manejar errores
  useEffect(() => {
    if (inventoryError) {
      console.error('Error loading inventory:', inventoryError);
      setLoadingData(false);
    }
  }, [inventoryError]);

  const [updateInventory, { loading: updatingInventory }] = useMutation(UPDATE_INVENTORY, {
    onCompleted: async (data: any) => {
      const response = data?.Inventory?.update;
      if (response?.code === 200) {
        await saveBuildingDetails(parseInt(id));
        await saveInventoryItems(parseInt(id));
        toast.success('Inventario actualizado exitosamente');
        router.push('/inventory');
      } else {
        toast.error(response?.message || 'Error al actualizar el inventario');
      }
    },
    onError: (error) => {
      toast.error('Error al actualizar el inventario: ' + error.message);
    },
  });

  const [createBuildingDetails] = useMutation(CREATE_OR_UPDATE_BUILDING_DETAILS);
  const [createItems] = useMutation(CREATE_MULTIPLE_INVENTORY_ITEMS);
  const [deleteInventoryItems] = useMutation(DELETE_INVENTORY);

  useEffect(() => {
    if (!id) {
      return;
    }
    if (id === 'undefined' || id === 'NaN' || id === 'null') {
      console.error('Invalid inventory ID:', id);
      toast.error('ID de inventario inválido');
      router.push('/inventory');
      return;
    }
    getChurches();
    // Solo llamar si el id es válido
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId) && numericId > 0) {
      getInventory({ 
        variables: { id: String(numericId) }
      });
    } else {
      console.error('Invalid numeric ID:', id);
      toast.error('ID de inventario inválido');
      router.push('/inventory');
    }
  }, [id, getChurches, getInventory, router, params]);

  // Sincronizar loadingData con loadingInventory - pero solo si no hay datos cargados
  useEffect(() => {
    if (!loadingInventory && !inventoryError && Object.keys(accesorioItems).length === 0 && !inventoryData.churchId) {
    }
  }, [loadingInventory, inventoryError, accesorioItems, inventoryData]);

  const saveBuildingDetails = async (inventoryId: number) => {
    const buildingDetailsData = {
      inventoryId,
      propertyArea: buildingData.propertyArea ? parseFloat(buildingData.propertyArea) : null,
      builtArea: buildingData.builtArea ? parseFloat(buildingData.builtArea) : null,
      wallTypes: buildingData.wallTypes.length > 0 ? JSON.stringify(buildingData.wallTypes) : null,
      floorTypes: buildingData.floorTypes.length > 0 ? JSON.stringify(buildingData.floorTypes) : null,
      ceilingTypes: buildingData.ceilingTypes.length > 0 ? JSON.stringify(buildingData.ceilingTypes) : null,
      roofCovering: buildingData.roofCovering.length > 0 ? JSON.stringify(buildingData.roofCovering) : null,
      propertyEnclosure: buildingData.propertyEnclosure.length > 0 ? JSON.stringify(buildingData.propertyEnclosure) : null,
      numberOfDoors: buildingData.numberOfDoors ? parseInt(buildingData.numberOfDoors) : null,
      numberOfWindows: buildingData.numberOfWindows ? parseInt(buildingData.numberOfWindows) : null,
      electricalEnergy: buildingData.electricalEnergy || null,
      electricalEnergyOther: buildingData.electricalEnergyOther || null,
      water: buildingData.water || null,
      waterOther: buildingData.waterOther || null,
      bathroomDetails: buildingData.bathroomDetails || null,
      diningRoomDetails: buildingData.diningRoomDetails || null,
    };

    await createBuildingDetails({
      variables: { buildingDetails: buildingDetailsData },
    });
  };

  const saveInventoryItems = async (inventoryId: number) => {
    // Primero eliminar items existentes (se puede mejorar con una mutation específica)
    // Por ahora, crear todos los items de nuevo
    
    const items: any[] = [];

    Object.entries(accesorioItems).forEach(([itemName, data]) => {
      if (data.hasItem || data.quantity) {
        items.push({
          inventoryId,
          itemName,
          category: 'ACCESORIO',
          hasItem: data.hasItem,
          quantity: data.quantity ? parseInt(data.quantity) : null,
        });
      }
    });

    Object.entries(vajillaItems).forEach(([itemName, data]) => {
      if (data.quantity) {
        items.push({
          inventoryId,
          itemName,
          category: 'VAJILLA_Y_CUBIERTOS',
          quantity: parseInt(data.quantity),
        });
      }
    });

    if (items.length > 0) {
      await createItems({
        variables: { items },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inventoryData.churchId || !inventoryData.year || !inventoryData.date) {
      toast.error('Los campos iglesia, año y fecha son requeridos');
      return;
    }

    await updateInventory({
      variables: {
        inventory: {
          id: parseInt(id),
          churchId: parseInt(inventoryData.churchId),
          year: inventoryData.year,
          date: inventoryData.date,
          observations: inventoryData.observations || null,
        },
      },
    });
  };

  const toggleCheckbox = (field: string, value: string) => {
    setBuildingData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  if (loadingInventory || loadingData) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Loader />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <Card>
            <CardHeader>
              <CardTitle>Editar Inventario de Bienes Muebles e Inmuebles</CardTitle>
              <CardDescription>
                Modifique los datos del inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="identification">Identificación</TabsTrigger>
                    <TabsTrigger value="construction">Construcción</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                  </TabsList>

                  <TabsContent value="identification" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="churchId">Iglesia/Local *</Label>
                        <Select
                          key={`church-${inventoryData.churchId}`}
                          value={inventoryData.churchId || undefined}
                          onValueChange={(value) => setInventoryData(prev => ({ ...prev, churchId: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una iglesia" />
                          </SelectTrigger>
                          <SelectContent>
                            {churches.map((church) => (
                              <SelectItem key={church.id} value={church.id.toString()}>
                                {church.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Año *</Label>
                        <Input
                          id="year"
                          type="number"
                          min="2020"
                          max="2100"
                          value={inventoryData.year}
                          onChange={(e) => setInventoryData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={inventoryData.date}
                        onChange={(e) => setInventoryData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observations">Observaciones</Label>
                      <Textarea
                        id="observations"
                        value={inventoryData.observations}
                        onChange={(e) => setInventoryData(prev => ({ ...prev, observations: e.target.value }))}
                        placeholder="Observaciones generales del inventario"
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="construction" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyArea">M² Propiedad</Label>
                        <Input
                          id="propertyArea"
                          type="number"
                          step="0.01"
                          value={buildingData.propertyArea}
                          onChange={(e) => setBuildingData(prev => ({ ...prev, propertyArea: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="builtArea">M² Edificados</Label>
                        <Input
                          id="builtArea"
                          type="number"
                          step="0.01"
                          value={buildingData.builtArea}
                          onChange={(e) => setBuildingData(prev => ({ ...prev, builtArea: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Muros</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Albañilería', 'Madera', 'Hormigón'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`wall-${type}`}
                              checked={buildingData.wallTypes.includes(type)}
                              onCheckedChange={() => toggleCheckbox('wallTypes', type)}
                            />
                            <Label htmlFor={`wall-${type}`} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Pisos</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Madera', 'Flexit', 'Cerámica', 'Cemento', 'Flotante'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`floor-${type}`}
                              checked={buildingData.floorTypes.includes(type)}
                              onCheckedChange={() => toggleCheckbox('floorTypes', type)}
                            />
                            <Label htmlFor={`floor-${type}`} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Cielo</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Madera', 'Cemento', 'Internit', 'Volcanita', 'Falso'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`ceiling-${type}`}
                              checked={buildingData.ceilingTypes.includes(type)}
                              onCheckedChange={() => toggleCheckbox('ceilingTypes', type)}
                            />
                            <Label htmlFor={`ceiling-${type}`} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cubierta de Techo</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Zinc', 'Pizarreño', 'Tejas'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`roof-${type}`}
                              checked={buildingData.roofCovering.includes(type)}
                              onCheckedChange={() => toggleCheckbox('roofCovering', type)}
                            />
                            <Label htmlFor={`roof-${type}`} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfDoors">N° de Puertas</Label>
                        <Input
                          id="numberOfDoors"
                          type="number"
                          value={buildingData.numberOfDoors}
                          onChange={(e) => setBuildingData(prev => ({ ...prev, numberOfDoors: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numberOfWindows">N° de Ventanas</Label>
                        <Input
                          id="numberOfWindows"
                          type="number"
                          value={buildingData.numberOfWindows}
                          onChange={(e) => setBuildingData(prev => ({ ...prev, numberOfWindows: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="electricalEnergy">Energía Eléctrica</Label>
                      <Select
                        key={`electrical-${buildingData.electricalEnergy}`}
                        value={buildingData.electricalEnergy || undefined}
                        onValueChange={(value) => setBuildingData(prev => ({ ...prev, electricalEnergy: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sí">Sí</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {buildingData.electricalEnergy === 'Otro' && (
                        <Input
                          placeholder="Especifique"
                          value={buildingData.electricalEnergyOther}
                          onChange={(e) => setBuildingData(prev => ({ ...prev, electricalEnergyOther: e.target.value }))}
                          className="mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="water">Agua</Label>
                      <Select
                        key={`water-${buildingData.water}`}
                        value={buildingData.water || undefined}
                        onValueChange={(value) => setBuildingData(prev => ({ ...prev, water: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Potable">Potable</SelectItem>
                          <SelectItem value="Pozo">Pozo</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {buildingData.water === 'Otro' && (
                        <Input
                          placeholder="Especifique"
                          value={buildingData.waterOther}
                          onChange={(e) => setBuildingData(prev => ({ ...prev, waterOther: e.target.value }))}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="items" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Accesorios</h3>
                        <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 border rounded-md">
                          {ACCESORIO_ITEMS.map((item) => (
                            <div key={item} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`acc-${item}`}
                                  checked={accesorioItems[item]?.hasItem || false}
                                  onCheckedChange={(checked) => {
                                    setAccesorioItems(prev => ({
                                      ...prev,
                                      [item]: { ...(prev[item] || { quantity: '' }), hasItem: checked === true }
                                    }));
                                  }}
                                />
                                <Label htmlFor={`acc-${item}`} className="cursor-pointer text-sm">{item}</Label>
                              </div>
                              {accesorioItems[item]?.hasItem && (
                                <Input
                                  type="number"
                                  placeholder="Cantidad"
                                  value={accesorioItems[item]?.quantity || ''}
                                  onChange={(e) => {
                                    setAccesorioItems(prev => ({
                                      ...prev,
                                      [item]: { ...(prev[item] || { hasItem: false }), quantity: e.target.value }
                                    }));
                                  }}
                                  className="h-8"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Vajilla y Cubiertos</h3>
                        <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 border rounded-md">
                          {VAJILLA_ITEMS.map((item) => (
                            <div key={item} className="space-y-2">
                              <Label htmlFor={`vaj-${item}`} className="text-sm">{item}</Label>
                              <Input
                                id={`vaj-${item}`}
                                type="number"
                                placeholder="Cantidad"
                                value={vajillaItems[item]?.quantity || ''}
                                onChange={(e) => {
                                  setVajillaItems(prev => ({
                                    ...prev,
                                    [item]: { quantity: e.target.value }
                                  }));
                                }}
                                className="h-8"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-6">
                  <Button type="submit" disabled={updatingInventory}>
                    {updatingInventory ? 'Actualizando...' : 'Actualizar Inventario'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

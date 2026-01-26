'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Html5Qrcode } from 'html5-qrcode';
import Rut from 'rutjs';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GET_REHEARSAL_BY_ID, GET_ATTENDANCE_BY_REHEARSAL, GET_ALL_MEMBERS, GET_ALL_CHURCH, GET_ALL_STATUS } from "@/services/query"
import { REGISTER_ATTENDANCE, DELETE_ATTENDANCE, CREATE_MEMBER } from "@/services/mutation"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { QrCode, X, Plus } from "lucide-react"
import { toTitleCase } from "@/lib/utils"

export default function AttendancePage() {
  const params = useParams();
  const router = useRouter();
  const rehearsalId = Number(params.id);
  const [rehearsal, setRehearsal] = useState<any>(null);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [rutInput, setRutInput] = useState('');
  const [rutError, setRutError] = useState<string | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isCreateMemberDialogOpen, setIsCreateMemberDialogOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({
    rut: '',
    names: '',
    lastNameDad: '',
    lastNameMom: '',
    dateOfBirth: '',
    address: '',
    telephone: '',
    mobile: '',
    email: '',
    maritalStatus: '',
    probationStartDate: '',
    fullMembershipDate: '',
    churchId: '',
    statusId: '',
    sexo: '',
  });
  const [memberFormRutError, setMemberFormRutError] = useState<string | undefined>(undefined);
  const [churches, setChurches] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  const [getRehearsal] = useLazyQuery(GET_REHEARSAL_BY_ID);
  const [getAttendances, { data: attendancesData, refetch: refetchAttendances }] = useLazyQuery(GET_ATTENDANCE_BY_REHEARSAL, {
    fetchPolicy: 'network-only',
  });
  const [getMembers] = useLazyQuery(GET_ALL_MEMBERS);
  const [getChurches] = useLazyQuery(GET_ALL_CHURCH);
  const [getStatuses] = useLazyQuery(GET_ALL_STATUS);

  // Sincronizar el estado con los datos de Apollo cuando cambien
  useEffect(() => {
    if ((attendancesData as any)?.Attendance?.getByRehearsal) {
      setAttendances((attendancesData as any).Attendance.getByRehearsal);
    }
  }, [attendancesData]);
  const [registerAttendance] = useMutation(REGISTER_ATTENDANCE, {
    refetchQueries: [
      {
        query: GET_ATTENDANCE_BY_REHEARSAL,
        variables: { rehearsalId },
      },
    ],
    awaitRefetchQueries: true,
  });
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE, {
    refetchQueries: [
      {
        query: GET_ATTENDANCE_BY_REHEARSAL,
        variables: { rehearsalId },
      },
    ],
    awaitRefetchQueries: true,
  });
  const [createMember] = useMutation(CREATE_MEMBER);

  useEffect(() => {
    if (rehearsalId) {
      loadRehearsal();
      loadAttendances();
    }
  }, [rehearsalId]);

  useEffect(() => {
    getChurches().then(({ data }) => {
      if ((data as any)?.Church?.getAll) {
        setChurches((data as any).Church.getAll);
      }
    });
    getStatuses().then(({ data }) => {
      if ((data as any)?.Status?.getAll) {
        setStatuses((data as any).Status.getAll);
      }
    });
  }, [getChurches, getStatuses]);

  useEffect(() => {
    // Limpiar scanner al desmontar el componente
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const loadRehearsal = async () => {
    try {
      const { data } = await getRehearsal({
        variables: { id: rehearsalId }
      });
      setRehearsal((data as any)?.Rehearsal?.getById);
    } catch (err) {
      toast.error('Error al cargar repaso');
    }
  };

  const loadAttendances = async () => {
    try {
      const { data } = await getAttendances({
        variables: { rehearsalId }
      });
      setAttendances((data as any)?.Attendance?.getByRehearsal || []);
    } catch (err) {
      toast.error('Error al cargar asistencias');
    }
  };

  const handleRutChange = (value: string) => {
    // Limpiar puntos y espacios, mantener solo números y guión/dígito verificador
    const cleanValue = value.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
    
    let newValue = cleanValue;
    if (cleanValue.length > 0) {
      try {
        // Si tiene guión o tiene 8+ caracteres (incluyendo dígito verificador), formatear
        if (cleanValue.includes('-') || cleanValue.length >= 8) {
          const rut = new Rut(cleanValue);
          newValue = rut.getNiceRut();
        } else {
          // Si aún no tiene formato completo, dejar como está
          newValue = cleanValue;
        }
      } catch {
        newValue = cleanValue;
      }
    } else {
      newValue = '';
    }
    
    setRutInput(newValue);
    
    // Validar RUT si tiene formato completo (con guión)
    if (newValue && newValue.includes('-')) {
      try {
        const rut = new Rut(newValue);
        const isValid = rut.isValid;
        setRutError(isValid ? undefined : 'RUT inválido');
      } catch {
        setRutError('RUT inválido');
      }
    } else if (newValue.length > 0) {
      // Limpiar error si aún no está completo
      setRutError(undefined);
    } else {
      setRutError(undefined);
    }
  };

  const handleRegisterAttendance = async (memberRut: string) => {
    if (!memberRut) {
      toast.error('RUT es requerido');
      return;
    }

    // Validar RUT antes de registrar
    if (memberRut.includes('-')) {
      try {
        const rut = new Rut(memberRut);
        if (!rut.isValid) {
          setRutError('RUT inválido');
          toast.error('Por favor, ingresa un RUT válido');
          return;
        }
      } catch {
        setRutError('RUT inválido');
        toast.error('Por favor, ingresa un RUT válido');
        return;
      }
    } else {
      toast.error('Por favor, ingresa un RUT completo con formato válido');
      return;
    }

    const trimmedRut = memberRut.trim();

    try {
      // Primero verificar si el miembro existe
      const { data: membersData } = await getMembers({
        variables: { churchId: 0, typeMember: 0 }
      });
      
      const members = (membersData as any)?.Member?.getAll || [];
      const memberExists = members.find((m: any) => m.rut === trimmedRut);

      if (!memberExists) {
        toast.error(`El miembro con RUT ${trimmedRut} no existe. Por favor, créalo primero en la sección de Miembros marcándolo como corista de Coros Unidos.`);
        return;
      }

      // Si el miembro existe, registrar la asistencia
      const { data } = await registerAttendance({
        variables: {
          rehearsalId,
          memberRut: trimmedRut
        }
      });

      if ((data as any)?.Attendance?.register?.code === 200) {
        toast.success('Asistencia registrada exitosamente');
        setRutInput('');
        setRutError(undefined);
        // Refrescar la lista de asistencias - refetchQueries ya lo hace, pero también llamamos loadAttendances por si acaso
        setTimeout(async () => {
          await loadAttendances();
        }, 300);
      } else {
        toast.error((data as any)?.Attendance?.register?.message || 'Error al registrar asistencia');
      }
    } catch (err: any) {
      // Si el error es que el miembro no existe, mostrar mensaje
      if (err.message?.includes('Miembro no existe') || err.message?.includes('no existe')) {
        toast.error(`El miembro con RUT ${trimmedRut} no existe. Por favor, créalo primero en la sección de Miembros marcándolo como corista de Coros Unidos.`);
      } else {
        toast.error(err.message || 'Error al registrar asistencia');
      }
    }
  };

  const handleDeleteAttendance = async (memberRut: string) => {
    if (!confirm('¿Estás seguro de eliminar esta asistencia?')) return;

    try {
      const { data } = await deleteAttendance({
        variables: {
          rehearsalId,
          memberRut
        }
      });

      if ((data as any)?.Attendance?.delete?.code === 200) {
        toast.success('Asistencia eliminada exitosamente');
        // Refrescar la lista de asistencias - refetchQueries ya lo hace, pero también llamamos loadAttendances por si acaso
        setTimeout(async () => {
          await loadAttendances();
        }, 300);
      } else {
        toast.error((data as any)?.Attendance?.delete?.message || 'Error al eliminar asistencia');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar asistencia');
    }
  };

  const startScanning = async () => {
    try {
      // Verificar si hay acceso a la cámara
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Detener inmediatamente para liberar
      } catch (cameraError: any) {
        setIsScanning(false);
        if (cameraError.name === 'NotAllowedError') {
          toast.error('Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración del navegador.');
        } else if (cameraError.name === 'NotFoundError') {
          toast.error('No se encontró ninguna cámara disponible.');
        } else {
          toast.error('Error al acceder a la cámara: ' + cameraError.message);
        }
        return;
      }

      // Primero establecer el estado para que el elemento se renderice
      setIsScanning(true);
      
      // Esperar un momento para que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar que el elemento existe
      const element = document.getElementById("qr-reader");
      if (!element) {
        setIsScanning(false);
        toast.error('No se pudo encontrar el elemento del escáner');
        return;
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          let formattedRut = '';
          let runExtracted = false;
          
          toast.info('Código QR escaneado, procesando...');
          
          // Verificar si es una URL con parámetro RUN
          if (decodedText.includes('RUN=') || decodedText.includes('R.UN=') || decodedText.match(/[Rr]\.?[Uu]\.?[Nn]\.?=/)) {
            toast.info('URL detectada, extrayendo RUN...');
            try {
              let runValueComplete = '';
              
              // Método 1: Usar URLSearchParams si es una URL completa
              try {
                const url = new URL(decodedText);
                runValueComplete = url.searchParams.get('RUN') || url.searchParams.get('run') || '';
                if (runValueComplete) {
                  toast.info(`RUN completo extraído (URLSearchParams): ${runValueComplete}`);
                }
              } catch (urlError) {
                // Si no es una URL válida, usar regex
              }
              
              // Método 2: Usar regex para extraer todo después de RUN= hasta encontrar &type o &
              if (!runValueComplete) {
                // Busca RUN= seguido de todo hasta encontrar &type, & o espacio
                const runMatch = decodedText.match(/[Rr]\.?[Uu]\.?[Nn]\.?=([^&\s]+)/i);
                if (runMatch && runMatch[1]) {
                  runValueComplete = runMatch[1];
                  toast.info(`RUN completo extraído (regex): ${runValueComplete}`);
                }
              }
              
              if (runValueComplete) {
                // Procesar el valor completo: limpiar puntos pero mantener guión y dígito verificador
                // Remover puntos pero mantener el formato con guión y dígito verificador
                let cleanedRut = runValueComplete.replace(/\./g, '').trim();
                toast.info(`RUT limpio (sin puntos): ${cleanedRut}`);
                
                // Verificar que tenga formato con guión y dígito verificador
                if (cleanedRut.includes('-')) {
                  // Ya tiene guión y dígito verificador, solo formatearlo (sin validar)
                  const rut = new Rut(cleanedRut);
                  formattedRut = rut.getNiceRut();
                  toast.info(`RUT formateado: ${formattedRut}`);
                  
                  // No validamos, solo formateamos ya que viene del QR del carnet
                  if (formattedRut && formattedRut.includes('-') && formattedRut.split('-')[1]) {
                    runExtracted = true;
                    toast.success(`RUT formateado correctamente: ${formattedRut}`);
                  }
                } else {
                  // No tiene guión, solo dígitos, calcular el dígito verificador
                  const digitsOnly = cleanedRut.replace(/[^\d]/g, '');
                  toast.info(`Solo dígitos (sin guión): ${digitsOnly}`);
                  
                  if (digitsOnly && digitsOnly.length >= 7 && digitsOnly.length <= 9) {
                    const rut = new Rut(digitsOnly);
                    formattedRut = rut.getNiceRut();
                    toast.info(`RUT formateado (dígito calculado): ${formattedRut}`);
                    
                    if (formattedRut && formattedRut.includes('-') && formattedRut.split('-')[1]) {
                      runExtracted = true;
                      toast.success(`RUT formateado: ${formattedRut}`);
                    }
                  } else {
                    toast.error(`RUN inválido (longitud: ${digitsOnly?.length || 0}): ${digitsOnly || 'ninguno'}`);
                  }
                }
              } else {
                toast.error('No se pudo extraer el valor de RUN');
              }
              
              // Si no se extrajo con el primer método, intentar método alternativo
              if (!runExtracted) {
                toast.info('Método 1 falló, intentando método alternativo...');
                const afterEquals = decodedText.split(/[Rr]\.?[Uu]\.?[Nn]\.?=/)[1];
                if (afterEquals) {
                  // Tomar hasta encontrar & o espacio
                  const rawValue = afterEquals.split('&')[0].split(' ')[0];
                  toast.info(`Valor crudo (método 2): ${rawValue}`);
                  
                  // IMPORTANTE: Si hay un guión, tomar SOLO lo que está ANTES del guión
                  // Esto ignora el dígito verificador que viene en el QR
                  const beforeDash = rawValue.split('-')[0];
                  toast.info(`Antes del guión (método 2): ${beforeDash}`);
                  
                  // Extraer SOLO dígitos numéricos (sin puntos, sin guiones, sin letras)
                  const digitsOnly = beforeDash.replace(/[^\d]/g, '');
                  toast.info(`Solo dígitos (método 2, ignorando dígito verificador): ${digitsOnly}`);
                  
                  if (digitsOnly && digitsOnly.length >= 7 && digitsOnly.length <= 9) {
                    const rut = new Rut(digitsOnly);
                    formattedRut = rut.getNiceRut();
                    toast.info(`RUT formateado (método 2): ${formattedRut}`);
                    // Verificar que el RUT tenga el formato completo con dígito verificador (debe tener guión y dígito)
                    if (formattedRut && formattedRut.includes('-') && formattedRut.split('-')[1]) {
                      runExtracted = true;
                      toast.success(`RUT válido (método 2): ${formattedRut}`);
                    }
                  }
                }
              }
              
              // Si aún no se extrajo, intentar buscar cualquier secuencia de 7-9 dígitos consecutivos en el texto
              if (!runExtracted) {
                toast.info('Método 2 falló, buscando números en el texto...');
                const allNumbers = decodedText.match(/\d{7,9}/g);
                if (allNumbers && allNumbers.length > 0) {
                  toast.info(`Números encontrados: ${allNumbers.join(', ')}`);
                  // Tomar el primer número que parezca un RUN válido (solo dígitos, sin puntos)
                  const possibleRun = allNumbers[0];
                  toast.info(`Probando RUN: ${possibleRun}`);
                  if (possibleRun.length >= 7 && possibleRun.length <= 9) {
                    const rut = new Rut(possibleRun);
                    formattedRut = rut.getNiceRut();
                    toast.info(`RUT formateado (método 3): ${formattedRut}`);
                    // Verificar que el RUT tenga el formato completo con dígito verificador (debe tener guión y dígito)
                    if (formattedRut && formattedRut.includes('-') && formattedRut.split('-')[1]) {
                      runExtracted = true;
                      toast.success(`RUT válido (método 3): ${formattedRut}`);
                    }
                  }
                }
              }
              
              if (!runExtracted) {
                stopScanning();
                toast.error('No se pudo extraer el RUT del código QR');
                return;
              }
            } catch (err: any) {
              stopScanning();
              toast.error(`Error al procesar: ${err?.message || 'Error desconocido'}`);
              return;
            }
          } else {
            // Procesar como RUT directo (no es una URL)
            toast.info('No es URL, procesando como RUT directo...');
            const cleanValue = decodedText.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
            toast.info(`Texto limpio: ${cleanValue}`);
            
            try {
              if (cleanValue.includes('-') || cleanValue.length >= 8) {
                const rut = new Rut(cleanValue);
                formattedRut = rut.getNiceRut();
                toast.info(`RUT formateado (directo): ${formattedRut}`);
              } else {
                // Intentar extraer solo números si hay muchos caracteres
                const numbersOnly = cleanValue.match(/\d{7,9}/)?.[0];
                toast.info(`Números extraídos: ${numbersOnly}`);
                if (numbersOnly) {
                  const rut = new Rut(numbersOnly);
                  formattedRut = rut.getNiceRut();
                  toast.info(`RUT formateado (números): ${formattedRut}`);
                } else {
                  stopScanning();
                  toast.error('El código escaneado no contiene un RUT válido');
                  return;
                }
              }
            } catch (err: any) {
              stopScanning();
              toast.error(`Error al procesar RUT directo: ${err?.message || 'Error desconocido'}`);
              return;
            }
          }
          
          // Solo actualizar el input si se extrajo un RUT formateado con dígito verificador
          if (formattedRut && formattedRut.includes('-')) {
            // Verificar que tenga dígito verificador después del guión
            const rutParts = formattedRut.split('-');
            toast.info(`Partes del RUT: ${rutParts.join(' | ')}`);
            if (rutParts.length === 2 && rutParts[1] && rutParts[1].length > 0) {
              toast.success(`RUT completo formateado: ${formattedRut}`);
              
              // Validar el RUT (también cuando viene del QR, por si acaso)
              try {
                const rut = new Rut(formattedRut);
                toast.info(`Validando RUT: ${formattedRut}, válido: ${rut.isValid}`);
                
                if (rut.isValid) {
                  setRutInput(formattedRut);
                  setRutError(undefined);
                  toast.success(`RUT válido, registrando asistencia...`);
                  // Registrar asistencia después de un pequeño delay
                  setTimeout(async () => {
                    await handleRegisterAttendance(formattedRut);
                    stopScanning();
                  }, 100);
                } else {
                  // Si viene del QR pero es inválido, mostrar advertencia pero permitir continuar
                  // (ya que viene del carnet oficial, podría ser un problema de formato)
                  toast.warning(`RUT del QR no pasó validación, pero continuando...`);
                  setRutInput(formattedRut);
                  setRutError(undefined);
                  setTimeout(async () => {
                    await handleRegisterAttendance(formattedRut);
                    stopScanning();
                  }, 100);
                }
              } catch (err: any) {
                // Si hay error al validar, mostrar advertencia pero continuar
                toast.warning(`Error al validar RUT del QR: ${err?.message || 'Error desconocido'}, pero continuando...`);
                setRutInput(formattedRut);
                setRutError(undefined);
                setTimeout(async () => {
                  await handleRegisterAttendance(formattedRut);
                  stopScanning();
                }, 100);
              }
            } else {
              stopScanning();
              toast.error(`El RUT extraído no tiene dígito verificador válido. RUT: ${formattedRut}`);
            }
          } else {
            stopScanning();
            toast.error(`No se pudo extraer un RUT válido. Formato obtenido: ${formattedRut || 'ninguno'}`);
          }
        },
        (errorMessage) => {
          // Ignorar errores de escaneo continuo (como "NotFoundException")
          if (errorMessage && !errorMessage.includes("NotFoundException")) {
            console.log("Error de escaneo:", errorMessage);
          }
        }
      );
    } catch (err: any) {
      setIsScanning(false);
      const errorMessage = err?.message || 'Error al iniciar el escáner';
      toast.error(errorMessage);
      console.error('Error al iniciar escáner:', err);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
        scannerRef.current = null;
        setIsScanning(false);
      }).catch((err) => {
        console.error('Error al detener escáner:', err);
        setIsScanning(false);
      });
    } else {
      setIsScanning(false);
    }
  };

  const handleMemberFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldsToTitleCase = ['names', 'lastNameDad', 'lastNameMom', 'address'];
    
    let newValue = value;
    if (fieldsToTitleCase.includes(name)) {
      newValue = toTitleCase(value);
    } else if (name === 'rut') {
      // Formatear RUT mientras se escribe usando rutjs
      const cleanValue = value.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
      
      if (cleanValue.length > 0) {
        try {
          // Si tiene guión o tiene 8+ caracteres (incluyendo dígito verificador), formatear
          if (cleanValue.includes('-') || cleanValue.length >= 8) {
            const rut = new Rut(cleanValue);
            newValue = rut.getNiceRut();
          } else {
            // Si aún no tiene formato completo, dejar como está
            newValue = cleanValue;
          }
        } catch {
          newValue = cleanValue;
        }
      } else {
        newValue = '';
      }
      
      // Validar RUT si tiene formato completo (con guión)
      if (newValue && newValue.includes('-')) {
        try {
          const rut = new Rut(newValue);
          const isValid = rut.isValid;
          setMemberFormRutError(isValid ? undefined : 'RUT inválido');
        } catch {
          setMemberFormRutError('RUT inválido');
        }
      } else if (newValue.length > 0) {
        // Limpiar error si aún no está completo
        setMemberFormRutError(undefined);
      } else {
        setMemberFormRutError(undefined);
      }
    }

    setMemberForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleMemberFormSelectChange = (name: string, value: string) => {
    setMemberForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateMember = async () => {
    // Validar RUT antes de enviar
    let rutValid = false;
    
    if (memberForm.rut) {
      try {
        const rut = new Rut(memberForm.rut);
        rutValid = rut.isValid;
      } catch {
        rutValid = false;
      }
    }
    
    if (!rutValid) {
      setMemberFormRutError('RUT inválido');
      toast.error('Por favor, ingresa un RUT válido.');
      return;
    }
    
    // Validar campos requeridos
    if (!memberForm.rut || !memberForm.names || !memberForm.lastNameDad || !memberForm.lastNameMom || 
        !memberForm.dateOfBirth || !memberForm.address || !memberForm.telephone || !memberForm.mobile || 
        !memberForm.email || !memberForm.maritalStatus || !memberForm.sexo) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    try {
      const { data } = await createMember({
        variables: {
          member: {
            ...memberForm,
            churchId: memberForm.churchId || null,
            statusId: memberForm.statusId || null,
            probationStartDate: memberForm.probationStartDate || null,
            fullMembershipDate: memberForm.fullMembershipDate || null,
            isCorosUnidos: true, // true para miembros creados desde Coros Unidos
          }
        }
      });

      const response = (data as any)?.Member?.create;
      if (response?.code === 200 || response?.code === 201) {
        toast.success(response.message || 'Miembro creado exitosamente');
        setIsCreateMemberDialogOpen(false);
        // Limpiar formulario
        setMemberForm({
          rut: '',
          names: '',
          lastNameDad: '',
          lastNameMom: '',
          dateOfBirth: '',
          address: '',
          telephone: '',
          mobile: '',
          email: '',
          maritalStatus: '',
          probationStartDate: '',
          fullMembershipDate: '',
          churchId: '',
          statusId: '',
          sexo: '',
        });
        setMemberFormRutError(undefined);
      } else {
        toast.error(response?.message || 'Error al crear miembro');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al crear miembro');
    }
  };


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
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Registrar Asistencia</h1>
              {rehearsal && (
                <p className="text-gray-600 mt-1">
                  {format(new Date(rehearsal.date), "PPP", { locale: es })}
                  {rehearsal.church && ` - ${rehearsal.church.name}`}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateMemberDialogOpen} onOpenChange={setIsCreateMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Miembro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Miembro - Coros Unidos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-rut">RUT *</Label>
                        <Input
                          id="member-rut"
                          name="rut"
                          value={memberForm.rut}
                          onChange={handleMemberFormChange}
                          placeholder="12345678-9"
                          className={memberFormRutError ? "border-destructive" : ""}
                        />
                        {memberFormRutError && (
                          <p className="text-sm text-destructive">{memberFormRutError}</p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="member-names">Nombres *</Label>
                        <Input
                          id="member-names"
                          name="names"
                          value={memberForm.names}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-lastNameDad">Apellido Paterno *</Label>
                        <Input
                          id="member-lastNameDad"
                          name="lastNameDad"
                          value={memberForm.lastNameDad}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-lastNameMom">Apellido Materno *</Label>
                        <Input
                          id="member-lastNameMom"
                          name="lastNameMom"
                          value={memberForm.lastNameMom}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-dateOfBirth">Fecha de Nacimiento *</Label>
                        <Input
                          id="member-dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={memberForm.dateOfBirth}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-sexo">Sexo *</Label>
                        <Select value={memberForm.sexo} onValueChange={(value) => handleMemberFormSelectChange('sexo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Femenino">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-maritalStatus">Estado Civil *</Label>
                        <Select value={memberForm.maritalStatus} onValueChange={(value) => handleMemberFormSelectChange('maritalStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Soltero">Soltero</SelectItem>
                            <SelectItem value="Casado">Casado</SelectItem>
                            <SelectItem value="Divorciado">Divorciado</SelectItem>
                            <SelectItem value="Viudo">Viudo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="member-address">Dirección *</Label>
                      <Input
                        id="member-address"
                        name="address"
                        value={memberForm.address}
                        onChange={handleMemberFormChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-telephone">Teléfono *</Label>
                        <Input
                          id="member-telephone"
                          name="telephone"
                          type="tel"
                          value={memberForm.telephone}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-mobile">Celular *</Label>
                        <Input
                          id="member-mobile"
                          name="mobile"
                          type="tel"
                          value={memberForm.mobile}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email *</Label>
                      <Input
                        id="member-email"
                        name="email"
                        type="email"
                        value={memberForm.email}
                        onChange={handleMemberFormChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-churchId">Iglesia</Label>
                        <Select value={memberForm.churchId || undefined} onValueChange={(value) => handleMemberFormSelectChange('churchId', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una iglesia (opcional)" />
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
                        <Label htmlFor="member-statusId">Estado</Label>
                        <Select value={memberForm.statusId || undefined} onValueChange={(value) => handleMemberFormSelectChange('statusId', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estado (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.id} value={status.id.toString()}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-probationStartDate">Fecha Inicio Prueba</Label>
                        <Input
                          id="member-probationStartDate"
                          name="probationStartDate"
                          type="date"
                          value={memberForm.probationStartDate}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-fullMembershipDate">Fecha Membresía Completa</Label>
                        <Input
                          id="member-fullMembershipDate"
                          name="fullMembershipDate"
                          type="date"
                          value={memberForm.fullMembershipDate}
                          onChange={handleMemberFormChange}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateMemberDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateMember}>
                      Crear Miembro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => router.back()}>
                Volver
              </Button>
            </div>
          </div>

          <Tabs defaultValue="register" className="w-full">
            <TabsList>
              <TabsTrigger value="register">Registrar</TabsTrigger>
              <TabsTrigger value="list">Lista de Asistencia</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Registrar Asistencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="rut">RUT del Miembro</Label>
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1">
                        <Input
                          id="rut"
                          type="text"
                          value={rutInput}
                          onChange={(e) => handleRutChange(e.target.value)}
                          placeholder="12345678-9"
                          className={rutError ? "border-destructive" : ""}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !rutError) {
                              handleRegisterAttendance(rutInput);
                            }
                          }}
                        />
                        {rutError && (
                          <p className="text-sm text-destructive mt-1">{rutError}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRegisterAttendance(rutInput)}
                        disabled={!!rutError || !rutInput}
                      >
                        Registrar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <QrCode className="h-12 w-12 mx-auto text-gray-400" />
                          <div>
                            {!isScanning ? (
                              <Button onClick={startScanning} className="w-full">
                                Escanear QR
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                <div id="qr-reader" className="w-full min-h-[250px]"></div>
                                <Button onClick={stopScanning} variant="destructive" className="w-full">
                                  <X className="h-4 w-4 mr-2" />
                                  Detener Escaneo
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Asistencia ({attendances.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {attendances.map((attendance) => (
                      <div
                        key={attendance.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {attendance.member?.names} {attendance.member?.lastNameDad} {attendance.member?.lastNameMom}
                          </p>
                          <p className="text-sm text-gray-500">
                            RUT: {attendance.memberRut} - 
                            Registrado: {format(new Date(attendance.attendedAt), "PPp", { locale: es })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAttendance(attendance.memberRut)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                    {attendances.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No hay asistencias registradas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import jsPDF from 'jspdf';
import Matrimonio from './matrimonioBase64.json';
import { PoppinsRegularBase64, PoppinsSemiBoldBase64, PoppinsBoldBase64 } from './poppins-font';

interface MarriageData {
  id: string;
  fullNameHusband: string;
  fullNameWife: string;
  civilDate: string;
  religiousDate: string;
  civilPlace: string;
  registrationNumber?: string;
  registrationDate?: string;
  civilCode: number;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

function formatDateComplete(dateString: string): [string, string, string] {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const [day, month, year] = dateString.split('-');
  const monthName = months[parseInt(month, 10) - 1];

  return [day, monthName, year];
}

export function generateMarriageCertificate(data: MarriageData): void {
  console.log(data);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  // Cargar fuente Poppins si está disponible
  if (PoppinsRegularBase64 && PoppinsSemiBoldBase64 && PoppinsBoldBase64) {
    try {
      // Cargar Regular
      doc.addFileToVFS('Poppins-Regular.ttf', PoppinsRegularBase64);
      doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
      
      // Cargar SemiBold
      doc.addFileToVFS('Poppins-SemiBold.ttf', PoppinsSemiBoldBase64);
      doc.addFont('Poppins-SemiBold.ttf', 'Poppins', 'semi-bold');
      
      // Cargar Bold
      doc.addFileToVFS('Poppins-Bold.ttf', PoppinsBoldBase64);
      doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');
      
      doc.setFont("Poppins", "normal");
    } catch (error) {
      console.warn('Error loading Poppins font, using helvetica:', error);
      doc.setFont("helvetica", "normal");
    }
  } else {
    // Fallback a helvetica si Poppins no está disponible
    doc.setFont("helvetica", "normal");
  }
  const fechaCivil = formatDateComplete(formatDate(data.civilDate));
  const fechaReligiosa = formatDateComplete(formatDate(data.religiousDate));
  const fechaRegistro = data.registrationDate 
    ? formatDateComplete(formatDate(data.registrationDate))
    : ['', '', ''];

  doc.setFontSize(14);
  doc.addImage(Matrimonio.data, 'PNG', 5, 5, 205, 205);
  
  // Usar semi-bold para los nombres
  doc.setFont(PoppinsSemiBoldBase64 ? "Poppins" : "helvetica", PoppinsSemiBoldBase64 ? "semi-bold" : "normal");
  doc.text(`${data.fullNameHusband}`, 36, 116);
  doc.text(`${data.fullNameWife}`, 36, 123);
  
  
  doc.text(`${data.civilCode}`, 72, 134);
  doc.text(`${data.civilPlace}`, 62, 157);
  doc.text(`${fechaCivil[0]}`, 118, 157);
  doc.text(`${fechaCivil[1]}`, 135, 157);
  doc.text(`${fechaCivil[2]}`, 171, 157);



  if (data.registrationNumber) {
    doc.text(`${data.registrationNumber}`, 134, 163);
  }
  if (data.registrationDate) {
    doc.text(`${fechaRegistro[0]}`, 40, 170);
    doc.text(`${fechaRegistro[1]}`, 57, 170);
    doc.text(`${fechaRegistro[2]}`, 93, 170);
  }
  
  doc.setFont(PoppinsBoldBase64 ? "Poppins" : "helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${fechaReligiosa[0]} de ${fechaReligiosa[1]} de ${fechaReligiosa[2]}`, 76, 205);

  doc.save(`CertificadoMatrimonio_${data.id}.pdf`);
}

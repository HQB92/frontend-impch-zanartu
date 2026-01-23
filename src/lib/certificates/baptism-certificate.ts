import jsPDF from 'jspdf';
import Bautizo from './bautizoBase64.json';
import { PoppinsRegularBase64, PoppinsSemiBoldBase64, PoppinsBoldBase64 } from './poppins-font';

interface BaptismData {
  childFullName: string;
  childRUT: string;
  childDateOfBirth: string;
  fatherFullName: string;
  motherFullName: string;
  placeOfRegistration: string;
  baptismDate: string;
  registrationNumber: string;
  registrationDate: string;
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

export function generateBaptismCertificate(data: BaptismData): void {
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

  const fechaBautizo = formatDateComplete(formatDate(data.baptismDate));
  const fechaNacimiento = formatDateComplete(formatDate(data.childDateOfBirth));
  const fechaRegistro = formatDateComplete(formatDate(data.registrationDate));

  doc.setFontSize(14);
  doc.addImage(Bautizo.data, 'PNG', 5, 5, 205, 205);
  
  // Usar semi-bold para los nombres
  doc.setFont(PoppinsSemiBoldBase64 ? "Poppins" : "helvetica", PoppinsSemiBoldBase64 ? "semi-bold" : "normal");
  doc.text(`${data.childFullName}`, 36, 84);
  doc.text(`${data.fatherFullName}`, 43, 91);
  doc.text(`${data.motherFullName}`, 37, 98);
  doc.text(`${data.placeOfRegistration}`, 57, 105);
  doc.text(`${fechaNacimiento[0]}`, 118, 105);
  doc.text(`${fechaNacimiento[1]}`, 135, 105);
  doc.text(`${fechaNacimiento[2]}`, 171, 105);

  doc.text(`${data.childRUT}`, 39, 153);
  doc.text(`${data.registrationNumber}`, 134, 153);
  doc.text(`${fechaRegistro[0]}`, 40, 160);
  doc.text(`${fechaRegistro[1]}`, 57, 160);
  doc.text(`${fechaRegistro[2]}`, 93, 160);
  
  doc.setFont(PoppinsBoldBase64 ? "Poppins" : "helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${fechaBautizo[0]} de ${fechaBautizo[1]} de ${fechaBautizo[2]}`, 76, 203);
  doc.save(`CertificadoBautizo_${data.childRUT}.pdf`);
}

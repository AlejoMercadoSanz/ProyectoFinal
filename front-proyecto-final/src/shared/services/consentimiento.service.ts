import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Injectable } from '@angular/core';
import { Tratamiento } from '../../features/historia clinica/models/tratamiento.model';
import { Paciente } from '../../features/pacientes/models/paciente.model';

@Injectable({ providedIn: 'root' })
export class ConsentimientoService {

  generarPDF(paciente: Paciente, tratamientos: Tratamiento[]): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ANEXO HISTORIA CLINICA', pageWidth / 2, 12, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('NOMBRE Y APELLIDO:', margin, 20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${paciente.nombre} ${paciente.apellido}`, margin + 35, 20);
    doc.setFont('helvetica', 'normal');
    doc.text('N° BENEFICIO:', pageWidth / 2 - 10, 20);
    doc.text('HOJA N°:', pageWidth - 50, 20);
    doc.line(margin, 22, pageWidth - margin, 22);

    const rows = tratamientos.map((t, i) => [
      new Date(t.fecha).toLocaleDateString('es-AR'),
      String(i + 1),
      `${t.tipo}${t.descripcion ? ' - ' + t.descripcion : ''}`,
      '',
    ]);

    const filasVacias = Math.max(0, 12 - rows.length);
    for (let i = 0; i < filasVacias; i++) {
      rows.push(['', '', '', '']);
    }

    autoTable(doc, {
      startY: 25,
      head: [['FECHA', 'N°', 'TRATAMIENTO', 'FIRMA DEL PACIENTE']],
      body: rows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.2 },
      headStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 10 },
        2: { cellWidth: 100 },
        3: { cellWidth: 38 },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 5;

    doc.setLineDashPattern([2, 2], 0);
    doc.line(margin, finalY, pageWidth - margin, finalY);
    doc.setLineDashPattern([], 0);

    const y = finalY + 7;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('CONSENTIMIENTO INFORMADO', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    const punto1 = '1. Autorizo al Dr. / Dra. _________________________________________ a realizar el tratamiento informado en la presente.';
    const punto2 = '2. He conversado con el profesional sobre la naturaleza y el propósito del tratamiento, sobre la posibilidad de complicaciones, los riesgos y posibles métodos alternativos.';
    const punto3 = '3. Autorizo a proveer los servicios o tratamientos adicionales que considere razonables incluyendo la administración de anestesia local, prácticas radiológicas y otros métodos de diagnóstico.';

    const p1Lines = doc.splitTextToSize(punto1, pageWidth - margin * 2);
    doc.text(p1Lines, margin, y + 6);

    const y3 = y + 6 + p1Lines.length * 4 + 2;
    const p2Lines = doc.splitTextToSize(punto2, pageWidth - margin * 2);
    doc.text(p2Lines, margin, y3);

    const y4 = y3 + p2Lines.length * 4 + 2;
    const p3Lines = doc.splitTextToSize(punto3, pageWidth - margin * 2);
    doc.text(p3Lines, margin, y4);

    const yFirmas = y4 + p3Lines.length * 4 + 10;
    doc.line(margin, yFirmas, margin + 70, yFirmas);
    doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin, yFirmas);
    doc.setFontSize(7);
    doc.text('Firma y aclaración del paciente o familiar', margin, yFirmas + 4);
    doc.text('Firma y sello del Profesional', pageWidth - margin - 70, yFirmas + 4);

    const yNota = yFirmas + 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    const nota = 'Será obligatoria la firma del presente consentimiento informado para cada una de las prácticas que se realicen a la persona afiliada.';
    const notaLineas = doc.splitTextToSize(nota, pageWidth - margin * 2);
    doc.text(notaLineas, margin, yNota);

    doc.save(`consentimiento_${paciente.apellido}_${paciente.nombre}.pdf`);
  }
}
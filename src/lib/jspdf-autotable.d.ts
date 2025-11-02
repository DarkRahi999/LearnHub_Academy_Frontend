// Extend jsPDF type to include autoTable method with proper typing
import { UserOptions } from 'jspdf-autotable';
import jsPDF from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

// Extended interface that includes all jsPDF methods plus autoTable specific ones
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}
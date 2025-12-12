import html2Canvas from "html2canvas";
import jsPDF from "jspdf";

// if this doesn't work , i may want to try : PDFBolt which is server side API PDF Rendering
// this current solution is client side PDF rendering, which can result in fast performance,
// not as stylized
export const exportToPDF = async (elementId: string, fileName: string) => {
  try {
    // Get the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with elementId ${elementId} not found`);
    }
    // Convert the element to canvas
    const canvas = await html2Canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    // Get Canvas Dimensions
    const margin = 10; // 10mm of margin

    // Width
    const pageWidth = 210; // A4 width in mm
    const imgWidth = pageWidth - margin * 2;
    // Height
    const pageHeight = 297; // A4 height in mm
    const contentHeight = pageHeight - margin * 2;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Convert Canvas to image
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");

    // Add first page
    let position = margin; // Start with Top Margin

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= contentHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
    }

    // save PDF
    pdf.save(`${fileName}.pdf`);
    return { success: true };
  } catch (error) {
    console.error("Error generating the PDF: ", error);
    return { success: false, error };
  }
};

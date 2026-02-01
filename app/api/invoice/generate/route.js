import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { calculateGST } from "@/lib/gst";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Simple Number to Words converter (Indian numbering system)
function numberToWords(n) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numberToWords(n % 100) : '');
    return n.toString(); // Fallback for larger numbers in this simple demo
}

export async function POST(req) {
    const session = await auth();
    // Demo: allow guest
    // if (!session) ...

    const { orderId } = await req.json();
    console.log("Generating invoice for Order ID:", orderId);

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true }
    });
    console.log("Order found:", order ? order.id : "null");

    if (!order) return new Response("Order not found", { status: 404 });

    const doc = new jsPDF();
    const tax = calculateGST(order.amount);

    // Config
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper to draw border
    const drawBorder = (yStart, h) => doc.rect(margin, yStart, contentWidth, h);

    // --- Header ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Invoice", pageWidth / 2, y, { align: "center" });
    y += 5;

    // Title Section Border
    // drawBorder(y, 30);

    // Company Details (Top Left)
    const companyY = y + 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("IndiaStack SaaS Pvt Ltd", margin + 2, companyY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("123, Startup Hub, Koramangala", margin + 2, companyY + 5);
    doc.text("Bangalore, Karnataka - 560034", margin + 2, companyY + 10);
    doc.text("GSTIN: 29AABCU9603R1ZN", margin + 2, companyY + 15);
    doc.text("State Name: KarnatakaCode: 29", margin + 2, companyY + 20);

    // Invoice Details (Top Right)
    const invX = pageWidth / 2 + 5;
    doc.line(pageWidth / 2, y, pageWidth / 2, y + 35); // Vertical seperator

    doc.text(`Invoice No: ${order.id.slice(-8).toUpperCase()}`, invX, companyY);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, invX, companyY + 5);
    doc.text(`Order No: ${order.razorpayOrderId || 'N/A'}`, invX, companyY + 10);
    doc.text("Mode/Terms of Payment: Online", invX, companyY + 15);

    // Box for Header
    doc.rect(margin, y, contentWidth, 35); // Height 35
    y += 35;

    // --- Buyer Details ---
    const buyerY = y + 5;
    doc.text("Buyer (Bill to):", margin + 2, buyerY);
    doc.setFont("helvetica", "bold");
    doc.text(order.user.name || "Valued Customer", margin + 2, buyerY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(order.user.email || "", margin + 2, buyerY + 10);
    // doc.text("GSTIN: URP", margin + 2, buyerY + 15);

    doc.rect(margin, y, contentWidth, 20); // Height 20
    y += 20;

    // --- Item Table ---
    const tableHeaders = [["Sl No", "Description of Goods", "HSN/SAC", "Qty", "Rate", "Per", "Amount"]];
    const tableBody = [
        ["1", "SaaS Pro Plan Subscription", "998431", "1", tax.base.toFixed(2), "Nos", tax.base.toFixed(2)],
        ["", "(Software Service)", "", "", "", "", ""]
    ];

    doc.autoTable({
        startY: y,
        head: tableHeaders,
        body: tableBody,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
        margin: { left: margin, right: margin },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.1,
    });

    y = doc.lastAutoTable.finalY;

    // --- Totals Section ---
    const totalY = y;

    // Amount in words
    const totalInt = Math.floor(tax.total);
    doc.text("Amount Chargeable (in words):", margin + 2, totalY + 5);
    doc.setFont("helvetica", "bold");
    doc.text("INR " + numberToWords(totalInt) + " Only", margin + 2, totalY + 10);

    // Tax Breakdown Table (Mini)
    const taxData = [
        ["Taxable Value", "Central Tax", "State Tax", "Total Tax"],
        [tax.base.toFixed(2), `9%  ${tax.cgst.toFixed(2)}`, `9%  ${tax.sgst.toFixed(2)}`, (tax.cgst + tax.sgst).toFixed(2)]
    ];

    doc.autoTable({
        startY: totalY + 15,
        head: [["Taxable Value", "Central Tax", "State Tax", "Total Tax"]],
        body: [[tax.base.toFixed(2), `Amount: ${tax.cgst.toFixed(2)}`, `Amount: ${tax.sgst.toFixed(2)}`, (tax.cgst + tax.sgst).toFixed(2)]],
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        margin: { left: margin, right: margin }, // Adjust width if needed
        tableWidth: contentWidth / 1.5 // Make it smaller
    });

    // Grand Total Box (Bottom Right)
    // We can just put text for simplicity as autoTable handles layout hard to overlay
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total: INR ${tax.total.toFixed(2)}`, pageWidth - margin - 5, finalY, { align: 'right' });

    // Signatory
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const signY = finalY + 20;
    doc.text("for IndiaStack SaaS Pvt Ltd", pageWidth - margin - 5, signY, { align: 'right' });
    doc.text("Authorized Signatory", pageWidth - margin - 5, signY + 15, { align: 'right' });

    // Outer Border for whole page content? Maybe just segments. 
    // Tally often has one big outer rect.
    // doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2));

    const pdfBuffer = doc.output("arraybuffer");

    return new Response(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
        },
    });
}

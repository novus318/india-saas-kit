import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { calculateGST } from "@/lib/gst";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true }
    });

    if (!order) return new Response("Order not found", { status: 404 });

    const doc = new jsPDF();
    const tax = calculateGST(order.amount);

    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Invoice ID: ${order.id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36);
    doc.text(`Billed To: ${order.user.name || order.user.email}`, 14, 42);

    const tableData = [
        ["Description", "Amount"],
        ["SaaS Subscription", `INR ${tax.base.toFixed(2)}`],
        ["CGST (9%)", `INR ${tax.cgst.toFixed(2)}`],
        ["SGST (9%)", `INR ${tax.sgst.toFixed(2)}`],
        ["Total", `INR ${tax.total.toFixed(2)}`]
    ];

    doc.autoTable({
        startY: 50,
        head: [["Item", "Cost"]],
        body: tableData,
    });

    const pdfBuffer = doc.output("arraybuffer");

    return new Response(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
        },
    });
}

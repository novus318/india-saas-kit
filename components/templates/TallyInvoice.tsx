import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a nice font if available, otherwise fallback to Helvetica
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: { process: 1, padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    companyDetails: { fontSize: 9, color: '#666' },
    invoiceDetails: { alignItems: 'flex-end', fontSize: 9 },
    billTo: { marginTop: 20, marginBottom: 10 },
    billToTitle: { fontWeight: 'bold', fontSize: 9, color: '#999', marginBottom: 5 },
    table: { display: 'flex', width: 'auto', borderWidth: 1, borderColor: '#eee' },
    tableRow: { margin: 'auto', flexDirection: 'row' },
    tableHeader: { backgroundColor: '#f9fafb', borderBottomWidth: 1, borderColor: '#eee' },
    tableCol: { width: '15%', borderRightWidth: 1, borderRightColor: '#eee', padding: 5 },
    tableColDesc: { width: '55%', borderRightWidth: 1, borderRightColor: '#eee', padding: 5 },
    tableCell: { margin: 5, fontSize: 9 },
    totals: { marginTop: 20, alignItems: 'flex-end' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 5 },
    grandTotal: { fontSize: 12, fontWeight: 'bold', borderTopWidth: 1, borderColor: '#eee', paddingTop: 5, marginTop: 5 },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 8, textAlign: 'center', color: '#999' }
});

export const TallyInvoice = ({ order, tax }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Tax Invoice</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>IndiaStack SaaS Pvt Ltd</Text>
                        <Text style={styles.companyDetails}>123, Startup Hub, Koramangala</Text>
                        <Text style={styles.companyDetails}>Bangalore, Karnataka - 560034</Text>
                        <Text style={styles.companyDetails}>GSTIN: 29AABCU9603R1ZN</Text>
                    </View>
                </View>
                <View style={styles.invoiceDetails}>
                    <Text>Invoice #: {order.id.slice(-8).toUpperCase()}</Text>
                    <Text>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</Text>
                    <Text>Order ID: {order.razorpayOrderId}</Text>
                </View>
            </View>

            {/* Bill To */}
            <View style={styles.billTo}>
                <Text style={styles.billToTitle}>BILL TO</Text>
                <Text style={{ fontWeight: 'bold' }}>{order.user.name || 'Valued Customer'}</Text>
                <Text>{order.user.email}</Text>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={styles.tableColDesc}><Text style={styles.tableCell}>Description</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Qty</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Rate</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Amount</Text></View>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.tableColDesc}><Text style={styles.tableCell}>SaaS Pro Plan (Subscription)</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>1</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{tax.base.toFixed(2)}</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{tax.base.toFixed(2)}</Text></View>
                </View>
            </View>

            {/* Totals */}
            <View style={styles.totals}>
                <View style={styles.totalRow}>
                    <Text>Taxable Amount:</Text>
                    <Text>{tax.base.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>CGST (9%):</Text>
                    <Text>{tax.cgst.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>SGST (9%):</Text>
                    <Text>{tax.sgst.toFixed(2)}</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotal]}>
                    <Text>Total (INR):</Text>
                    <Text>{Math.round(tax.total).toFixed(2)}</Text>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                This is a computer generated invoice. No signature required.
                Built with IndiaStack SaaS Boilerplate.
            </Text>

        </Page>
    </Document>
);

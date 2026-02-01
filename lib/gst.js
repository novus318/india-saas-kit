export const calculateGST = (amount, isIGST = false) => {
    // 18% GST for SaaS in India
    const rate = 0.18;
    const tax = amount * rate;
    return {
        base: amount,
        cgst: isIGST ? 0 : tax / 2,
        sgst: isIGST ? 0 : tax / 2,
        igst: isIGST ? tax : 0,
        total: amount + tax
    };
};

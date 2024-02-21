
export const sendResponse = async ({ res, code, ...options }) => {
    return res.status(code).json({ ...options });
};
import { useState } from 'react';
import divinationApi from '../api/divinationApi';

const useDivination = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const askDivination = async (question, type = 'horoscope', options = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await divinationApi.getDivination(question, type, options);
            setResult(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { askDivination, loading, result, error };
};

export default useDivination;

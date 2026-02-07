import axiosClient from './axiosClient';

const divinationApi = {
    getDivination: (question, type = 'horoscope', options = {}) => {
        return axiosClient.post('/divination/ask', {
            question,
            type,
            birth_date: options.birthDate,
            birth_time: options.birthTime,
            gender: options.gender
        });
    },
    getHistory: () => {
        return axiosClient.get('/divination/history'); // Adjust endpoint as per server
    }
};

export default divinationApi;

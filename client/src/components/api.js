import axios from 'axios';

export const fetchUserEmail = async () => {
    try {
        const response = await axios.get(
            'http://localhost:5001/users/profile',
            { withCredentials: true }
        );
        return response.data.email;
    } catch (error) {
        throw new Error('Error fetching email:', error);
    }
};

export const signOut = async () => {
    try {
        const response = await axios.post(
            'http://localhost:5001/users/logout',
            {},
            { withCredentials: true }
        );
        console.log('User signed out:', response);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

export const fetchConversationData = async (conversationId) => {
    try {
        const response = await axios.get(
            `http://localhost:5001/conversationData/${conversationId}`
        );
        return response.data;
    } catch (error) {
        throw new Error('Error fetching conversation data:', error);
    }
};

export const fetchConversations = async () => {
    try {
        const response = await axios.get(
            'http://localhost:5001/getConversations',
            { withCredentials: true }
        );
        return response.data.firstMessages;
    } catch (error) {
        throw new Error('Error fetching conversations:', error);
    }
};
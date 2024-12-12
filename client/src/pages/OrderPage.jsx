import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/userProvider';
import api from '../services/api';


function OrderPage() {
    const { user } = useContext(UserContext);
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        if (user && user.serialNumber) {
            fetchPaymentDetails();
        }
    }, [user]);

    const fetchPaymentDetails = async () => {
        try {
            const response = await api.get(`/users/${user.serialNumber}/paymentDetails`);
            setPaymentDetails(response.data.paymentDetails);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        }
    };

    
    const putOrder = async () => {
        try {
            console.log(user);
            const response = await api.put(`/api/orders/${user.serialNumber}/confirm`,
                {customerNumber: user.serialNumber, status: 'confirmed', orderDate: new Date()});
            console.log(response.data);
        } catch (error) {
            console.error('Error putting order:', error);
        }
    }
    const maskPaymentDetails = (details) => {
        const last4Digits = details.slice(-4);
        return '*'.repeat(details.length - 4) + last4Digits;
    };

    return (
        <div style={{minHeight:"100vh"}}>
            <h2>Payment Details</h2>
            {paymentDetails ? (
                <div>
                    <p>Your saved card: {maskPaymentDetails(paymentDetails)}</p>
                    <button onClick={putOrder}>Confirmation and sending order</button>
                </div>
            ) : (
                <p>Loading payment details...</p>
            )}
        </div>
    );
}

export default OrderPage;

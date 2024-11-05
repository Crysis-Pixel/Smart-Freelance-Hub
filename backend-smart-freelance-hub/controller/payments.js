// controllers/payments.js
const { getConnectedClient } = require('../database/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const db_name = process.env.DATABASE_NAME;
const collection_payments = process.env.COLLECTION_PAYMENTS;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.processTransaction = async (req, res) =>{
    const { paymentId, contractId, amount, freelancerEmail } = req.body;
    const client = getConnectedClient();
    const db = client.db(db_name);

    const transaction = { 
        status: "Pending",
        contractId,
        paymentId, 
        freelancerEmail, 
        amount, 
        date: new Date()
    };

    try {
        // Insert transaction
        const transactionResult = await db.collection(process.env.COLLECTION_TRANSACTIONS).insertOne(transaction);
        res.status(200).json({ message: "Transaction inserted successfully.", transactionResult});
        console.log(transactionResult);
    } catch (error) {
        console.error("Error in transaction operation: ", error);
        res.status(500).json({ error: "transaction creation failed" });
    }

};

// Process payment with OTP delay
exports.processPayment = async (req, res) => {
    const { transactionId, senderemail, amount, freelancerEmail } = req.body;

    let transactionupdated = false;
    let clientbalanceupdated = false;
    let freelancerbalanceupdated = false;

    // Simulate OTP verification delay
    await sleep(10000); // 60 seconds

    // Atomic transaction simulation
    const client = getConnectedClient();
    const db = client.db(db_name);

    try {
        // Update freelancer’s total earnings
        const updateResultfreelancer = await db.collection(process.env.COLLECTION_USERS).updateOne(
            { email: freelancerEmail },
            { $inc: { totalBalance: amount } }
        );
        console.log("Freelancer's total earnings updated.");
        freelancerbalanceupdated = true;

        const updateResultclient = await db.collection(process.env.COLLECTION_USERS).updateOne(
            { email: senderemail },
            { $inc: { totalBalance: -amount } }
        );
        console.log("Client's total earnings updated.");
        clientbalanceupdated = true;

        const updateTransaction = await db.collection(process.env.COLLECTION_TRANSACTIONS).updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { status: "Complete" } }
        );
        console.log("Transaction updated.");
        transactionupdated = true;

        res.status(200).json({ message: "Payment successful" });
    } catch (error) {

        if(freelancerbalanceupdated){
            const updateResultfreelancer = await db.collection(process.env.COLLECTION_USERS).updateOne(
            { email: freelancerEmail },
            { $inc: { totalBalance: -amount } }
        );}
        if(clientbalanceupdated){
            const updateResultclient = await db.collection(process.env.COLLECTION_USERS).updateOne(
            { email: senderemail },
            { $inc: { totalBalance: amount } }
        );}
        if(transactionupdated){
            const updateTransaction = await db.collection(process.env.COLLECTION_TRANSACTIONS).updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { status: "Incomplete" } }
        );}

        console.error("Error in payment operation: ", error);
        res.status(500).json({ error: "Payment operation failed" });
    }
};

exports.createPayment = async (req, res) => {
    const { paymentMethod, cardDetails, phoneNumber, useremail } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const newPayment = {
            paymentMethod,
            cardDetails,
            phoneNumber,
            useremail: useremail // Convert userId to ObjectId
        };

        const result = await collection.insertOne(newPayment);

        res.status(201).json({ message: 'Payment created successfully', paymentId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

exports.updatePayment = async (req, res) => {
    const { id, bankName, paymentMethod, userId } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid payment ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const updateData = {
            bankName,
            paymentMethod,
            userId: (userId)  // Convert userId to ObjectId
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update payment' });
    }
};

exports.deletePayment = async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid payment ID' });
    }

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete payment' });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const payments = await collection.find({}).toArray();

        res.status(200).json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve payments' });
    }
};

exports.getPaymentByEmail = async (req, res) => {
    const { useremail } = req.body;

    try {
        const client = getConnectedClient();
        const db = client.db(db_name);
        const collection = db.collection(collection_payments);

        const payment = await collection.findOne({ useremail: useremail });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve payment' });
    }
};

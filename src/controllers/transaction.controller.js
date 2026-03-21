//create a controller for transaction having user credentailas from authMiddleware in req.user.id and create a new transaction for the user and return the transaction details in response
import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import mongoose from "mongoose";
import { sendTransactionEmail } from "../services/email.service.js";

export async function createTransactionController(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "From account, to account, amount and idempotency key are required for the transaction",
    });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
  if (!fromUserAccount) {
    return res.status(404).json({
      message: "From account not found for the user",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  if (!toUserAccount) {
    return res.status(404).json({
      message: "To account not found for the user",
    });
  }

  const isTransactionExist = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionExist) {
    if (isTransactionExist.status === COMPLETED) {
      return res.status(200).json({
        message: "Transaction already exists and is completed",
        transaction: isTransactionExist,
      });
    }
    {
    }
    if (isTransactionExist.status === PENDING) {
      return res.status(200).json({
        message: "Transaction already exists and is pending",
        transaction: isTransactionExist,
      });
    }

    if (isTransactionExist.status === FAILED) {
      return res.status(200).json({
        message: "Transaction already exists and is failed",
        transaction: isTransactionExist,
      });
    }
  }
  if (isTransactionExist.status === REVERSED) {
    return res.status(200).json({
      message:
        "Transaction already exists and is reversed pleasse try again with a different idempotency key",
    });
  }

  //agar dono accounts active hai to hi transaction create karna hai otherwise error return karna hai
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "One or both accounts are not active for the transaction",
    });
  }

  const fromUserBalance = await fromUserAccount.getBalance();

  if (fromUserBalance < amount) {
    return res.status(400).json({
      message: `Insufficient balance your current balance: ${fromUserBalance} is less than the transaction amount: ${amount}`,
    });
  }

  //step 5 create transaction pending
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const transaction = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session },
    );

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction[0]._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction[0]._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    await sendTransactionEmail(
      req.user.email,
      req.user.name,
      `Your transaction of amount ${amount} from account ${fromAccount} to account ${toAccount} has been successfully completed. Transaction ID: ${transaction[0]._id}`,
    );

    return res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Transaction failed",
      error: error.message,
    });
  }
}

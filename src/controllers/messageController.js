const router = require("express").Router();
const ChatRoom = require("../models/ChatRoom");
const messageService = require("../services/messageService");

router.post("/createChatRoom", async (req, res) => {
  const { message, receiver } = req.body;
  try {
    const chatRoom = await messageService.createChatRoom(req.user._id, receiver);
    await ChatRoom.updateOne({ _id: chatRoom._id }, { $push: { conversation: { senderId: req.user._id, message } } });
    res.status(200).json({ messageId: chatRoom._id });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getUserConversations", async (req, res) => {
  try {
    const userId = req.user._id;
    const userChats = await ChatRoom.find({ $or: [{ buyer: userId }, { seller: userId }] })
      .populate("buyer")
      .populate("seller");
    const checkedChats = userChats.map((chats) => ({
      chats,
      isBuyer: chats.buyer._id.equals(userId),
      myId: userId,
    }));
    res.status(200).json(checkedChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendMessage", async (req, res) => {
  const { chatId, message } = req.body;
  try {
    await ChatRoom.updateOne({ _id: chatId }, { $push: { conversation: { senderId: req.user._id, message } } });
    res.status(200).json({ sender: req.user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

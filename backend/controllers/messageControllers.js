
const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;


  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// const ChangeMessage = asyncHandler(async (req, res) => {
//   try {
//     const apiUrl = "https://655.mtis.workers.dev/translate";
//     const params = {
//       'text': req.query.text,
//       'source_lang': req.query.source_lang,
//       'target_lang': req.query.target_lang,
//     };

//     const url = new URL(apiUrl);
//     url.search = new URLSearchParams(params).toString();
//     const options = {
//       method: 'GET',
//       headers: {
//         "Content-Type": "application/json"
//       }
//     };

//     const response = await fetch(url.toString(), options);
//     const data = await response.json();
//     console.log("data", data);
//     res.json(data);

//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

const ChangeMessage = asyncHandler(async (req, res) => {
  const { text, target_lang } = req.body;
  const authKey = '81ec9012-d9a4-45ca-ae1c-ab1c1513df7e:fx';

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${authKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text": [text],
        "target_lang": target_lang.toUpperCase()
      })
    });

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Error translating text:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { allMessages, sendMessage, ChangeMessage };

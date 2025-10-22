# ⛏️ Minecraft Aternos Keeper Bot

A **Node.js bot** that keeps your Minecraft server on Aternos (free hosting) **running 24/7** by simulating real player activity so it doesn’t shut down.

---

## ✅ Features

- 🤖 Automatically connects to your server
- 🎮 Simulates random player actions
- 🔄 Auto-reconnect on disconnect
- ⚡ Lightweight and efficient
- 🛠️ Easy to configure

---

## 🧠 How It Works

Aternos automatically stops servers when no players are online.  
This bot joins your server and performs random actions to **prevent it from going offline**.

---

## 📥 Installation

### 1. Clone the repository
```bash
git clone https://github.com/wolfl1x/AternosKeeperMinecraftBot.git
cd AternosKeeperMinecraftBot
```

### 2. Install dependencies

npm install

### 3. Configure the bot

Open bot.js and edit the server settings:

const SERVER_CONFIG = {
    host: 'your-server.aternos.me', // Your Aternos server address
    port: 25565,                    // Server port
    username: 'ServerKeeper'        // Bot username
};

🚀 Usage

Start using npm:

npm start

Or directly with Node.js:

node bot.js

⚙️ Configuration Options
Setting	Description	Default
host	Your Aternos server address	required
port	Server port	25565
username	Bot’s in-game name	AternosKeeper
🧭 Bot Activities

The bot periodically performs different actions to appear human:

    ✅ Random jumping

    ✅ Looking around

    ✅ Sneaking/crouching

    ✅ Random movement

    ✅ Switching inventory slots

    ✅ Auto-respawn on death

🔧 Requirements

    Node.js 14+

    Minecraft Java Edition server

    Aternos account

🔒 Server Setup Notes

Make sure to:

    Enable offline mode

    Whitelist the bot’s username (if using whitelist)

    Start the server before launching the bot

    Use the correct server version

🐛 Troubleshooting
Bot can’t connect

    Verify the server is online on Aternos

    Check the address & port

    Enable offline mode

Bot gets kicked

    Add the bot username to whitelist

    Check for IP bans

    Verify plugin compatibility

Network issues

    Check firewall settings

    Avoid VPN/proxy if possible

    Verify overall connection

⚠️ Legal Notice

This bot is intended for personal use on servers you own or have permission to manage.
Please respect Minecraft’s EULA and Aternos Terms of Service.
🤝 Contributing

Contributions are welcome!

    Submit pull requests

    Report bugs

    Suggest new features

📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.
💬 Support

If you encounter any issues:

    Check the troubleshooting section

    Open an issue on GitHub

    Ensure Node.js and dependencies are up to date

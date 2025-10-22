# Minecraft Aternos Keeper Bot

A Node.js bot that keeps your Minecraft server on Aternos (free hosting) active 24/7 by simulating player activity.

## Features

- 🤖 Automatically connects to your Minecraft server
- 🎮 Performs random player activities (jumping, moving, looking around)
- 🔄 Auto-reconnects when disconnected
- ⚡ Lightweight and efficient
- 🛠️ Easy to configure

## How It Works

Aternos free servers automatically shut down when no players are online. This bot connects to your server and performs random activities to simulate a real player, preventing the server from going offline.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/minecraft-aternos-keeper.git
   cd minecraft-aternos-keeper

Install dependencies
bash

npm install

Configure your server

    Edit bot.js and update the server configuration:

javascript

const SERVER_CONFIG = {
    host: 'your-server.aternos.me', // Your Aternos server address
    port: 25565,                    // Your server port
    username: 'ServerKeeper'        // Bot's in-game name
};

Usage

Start the bot:
bash

npm start

Or directly with Node.js:
bash

node bot.js

Configuration Options
Setting	Description	Default
host	Your Aternos server address	Required
port	Minecraft server port	25565
username	Bot's in-game username	'AternosKeeper'
Bot Activities

The bot performs various activities to appear as a real player:

    ✅ Random jumping

    ✅ Looking around

    ✅ Sneaking/crouching

    ✅ Random movement

    ✅ Switching inventory slots

    ✅ Auto-respawn on death

Requirements

    Node.js 14 or higher

    Minecraft Java Edition server

    Aternos account with server

Server Setup Notes

    Enable offline mode in your Aternos server settings

    Allow the bot username in your server whitelist (if enabled)

    Ensure the server is started before running the bot

Troubleshooting

Bot can't connect:

    Verify server is running on Aternos

    Check server address and port

    Ensure offline mode is enabled

Bot gets kicked:

    Add bot username to whitelist

    Check for IP bans

    Verify server version compatibility

Connection issues:

    Check firewall settings

    Verify network connectivity

    Ensure Aternos server is accessible

Legal Notice

This bot is intended for personal use on servers you own. Please respect Minecraft's EULA and Aternos's terms of service. Use responsibly and only on servers you're authorized to access.
Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
License

This project is licensed under the MIT License - see the LICENSE file for details.
Support

If you encounter any issues or have questions:

    Check the troubleshooting section above

    Open an issue on GitHub

    Ensure your Node.js and dependencies are up to date

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const vec3 = require('vec3');

class MinecraftBot {
    constructor(host, port, username = 'AternosKeeper') {
        this.config = {
            host: host,
            port: port,
            username: username,
            auth: 'offline'
        };
        
        this.bot = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        process.on('SIGINT', () => {
            console.log('🛑 Received interrupt signal...');
            this.disconnect();
            process.exit(0);
        });
        
        process.on('unhandledRejection', (error) => {
            console.error('💥 Unhandled exception:', error);
        });
    }
    
    connect() {
        console.log(`🔗 Connecting to ${this.config.host}:${this.config.port}...`);
        
        try {
            this.bot = mineflayer.createBot(this.config);
            this.setupBotEvents();
            
        } catch (error) {
            console.error('❌ Bot creation error:', error);
            this.scheduleReconnect();
        }
    }
    
    setupBotEvents() {
        this.bot.on('login', () => {
            console.log('✅ Successfully logged into server!');
            this.isConnected = true;
            this.reconnectAttempts = 0;
        });
        
        this.bot.on('spawn', () => {
            console.log('📍 Bot spawned in world');
            
            this.bot.loadPlugin(pathfinder);
            
            this.startActivityCycle();
        });
        
        this.bot.on('error', (error) => {
            console.error('💥 Bot error:', error);
            this.isConnected = false;
        });
        
        this.bot.on('end', (reason) => {
            console.log(`🔌 Disconnected from server: ${reason}`);
            this.isConnected = false;
            this.scheduleReconnect();
        });
        
        this.bot.on('message', (message) => {
            const text = message.toString().trim();
            console.log(`💬 Chat: ${text}`);
        });
        
        this.bot.on('death', () => {
            console.log('💀 Bot died...');
            setTimeout(() => {
                if (this.bot && this.isConnected) {
                    console.log('🔄 Attempting respawn...');
                    this.bot.chat('/spawn');
                }
            }, 3000);
        });
        
        this.bot.on('kicked', (reason) => {
            console.log(`🚫 Bot was kicked: ${reason}`);
            this.scheduleReconnect();
        });
    }
    
    startActivityCycle() {
        console.log('🎮 Starting activity cycle...');
        
        this.activityInterval = setInterval(() => {
            if (!this.isConnected || !this.bot) return;
            
            this.performRandomActivity();
            
        }, 30000 + Math.random() * 30000);
    }
    
    performRandomActivity() {
        if (!this.bot) return;
        
        const activities = [
            () => this.jump(),
            () => this.lookAround(),
            () => this.sneak(),
            () => this.moveRandomly(),
            () => this.switchItem()
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity();
    }
    
    jump() {
        if (this.bot) {
            this.bot.setControlState('jump', true);
            setTimeout(() => {
                if (this.bot) this.bot.setControlState('jump', false);
            }, 500);
            console.log('🦘 Bot jumped');
        }
    }
    
    lookAround() {
        if (this.bot) {
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            this.bot.look(yaw, pitch, false);
            console.log('👀 Bot looked around');
        }
    }
    
    sneak() {
        if (this.bot) {
            this.bot.setControlState('sneak', true);
            setTimeout(() => {
                if (this.bot) this.bot.setControlState('sneak', false);
            }, 2000);
            console.log('🦝 Bot sneaked');
        }
    }
    
    moveRandomly() {
        if (!this.bot || !this.bot.pathfinder) return;
        
        const directions = ['forward', 'back', 'left', 'right'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        this.bot.setControlState(direction, true);
        setTimeout(() => {
            if (this.bot) {
                directions.forEach(dir => this.bot.setControlState(dir, false));
            }
        }, 1000);
        
        console.log(`🚶 Bot moved ${direction}`);
    }
    
    switchItem() {
        if (this.bot && this.bot.inventory) {
            const selectedSlot = Math.floor(Math.random() * 9);
            this.bot.setQuickBarSlot(selectedSlot);
            console.log(`🔄 Bot switched to slot ${selectedSlot}`);
        }
    }
    
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('🚫 Maximum reconnection attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = Math.min(30000 * this.reconnectAttempts, 300000);
        
        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay/1000}sec...`);
        
        setTimeout(() => {
            this.connect();
        }, delay);
    }
    
    disconnect() {
        console.log('🔌 Disconnecting bot...');
        
        if (this.activityInterval) clearInterval(this.activityInterval);
        
        if (this.bot) {
            this.bot.quit();
            this.bot = null;
        }
        
        this.isConnected = false;
    }
}

const SERVER_CONFIG = {
    host: 'name.aternos.me', //Change name server
    port: 37194,             //Change your server port
    username: 'AternosKeeper'
};

console.log('🚀 Starting Minecraft bot for Aternos...');
console.log(`🎯 Server: ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
console.log(`🤖 Bot name: ${SERVER_CONFIG.username}`);
console.log('⏹️  Press Ctrl+C to stop\n');

const bot = new MinecraftBot(SERVER_CONFIG.host, SERVER_CONFIG.port, SERVER_CONFIG.username);
bot.connect();

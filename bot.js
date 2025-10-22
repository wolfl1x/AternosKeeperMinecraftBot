const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const vec3 = require('vec3');

class MinecraftBot {
    constructor(host, port, username = 'AternosKeeper') {
        this.config = {
            host: host,
            port: port,
            username: username,
            auth: 'offline' // Для cracked серверов
        };
        
        this.bot = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.chatEnabled = true; // Флаг для включения/выключения чата
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        process.on('SIGINT', () => {
            console.log('🛑 Получен сигнал прерывания...');
            this.disconnect();
            process.exit(0);
        });
        
        process.on('unhandledRejection', (error) => {
            console.error('💥 Необработанное исключение:', error);
        });
    }
    
    connect() {
        console.log(`🔗 Подключаемся к ${this.config.host}:${this.config.port}...`);
        
        try {
            this.bot = mineflayer.createBot(this.config);
            this.setupBotEvents();
            
        } catch (error) {
            console.error('❌ Ошибка создания бота:', error);
            this.scheduleReconnect();
        }
    }
    
    setupBotEvents() {
        // Событие успешного подключения
        this.bot.on('login', () => {
            console.log('✅ Успешный вход на сервер!');
            this.isConnected = true;
            this.reconnectAttempts = 0;
        });
        
        // Событие спавна в мире
        this.bot.on('spawn', () => {
            console.log('📍 Бот заспавнился в мире');
            
            // Загружаем плагин pathfinder для движения
            this.bot.loadPlugin(pathfinder);
            
            // Начинаем активность
            this.startActivityCycle();
        });
        
        // Событие ошибки
        this.bot.on('error', (error) => {
            console.error('💥 Ошибка бота:', error);
            this.isConnected = false;
        });
        
        // Событие отключения
        this.bot.on('end', (reason) => {
            console.log(`🔌 Отключились от сервера: ${reason}`);
            this.isConnected = false;
            this.scheduleReconnect();
        });
        
        // Событие получения сообщения в чат
        this.bot.on('message', (message) => {
            const text = message.toString().trim();
            console.log(`💬 Чат: ${text}`);
            
            // Обработка команды .nomessage
            if (text.toLowerCase().startsWith('.nomessage')) {
                this.handleNoMessageCommand(text);
                return;
            }
            
            // Включение чата обратно
            if (text.toLowerCase().startsWith('.message')) {
                this.handleMessageCommand(text);
                return;
            }
            
            // Отвечаем на приветствия (только если чат включен)
            if (this.chatEnabled && text.toLowerCase().includes('привет') && text.toLowerCase().includes(this.config.username.toLowerCase())) {
                this.sendChatMessage('Привет! Я поддерживаю сервер онлайн!');
            }
        });
        
        // Событие смерти
        this.bot.on('death', () => {
            console.log('💀 Бот умер...');
            setTimeout(() => {
                if (this.bot && this.isConnected) {
                    console.log('🔄 Попытка возрождения...');
                    this.bot.chat('/spawn');
                }
            }, 3000);
        });
        
        // Событие кика
        this.bot.on('kicked', (reason) => {
            console.log(`🚫 Бота кикнули: ${reason}`);
            this.scheduleReconnect();
        });
    }
    
    handleNoMessageCommand(text) {
        this.chatEnabled = false;
        console.log('🔇 Авто-сообщения в чат отключены');
        
        // Отправляем подтверждение в чат
        if (this.bot && this.isConnected) {
            this.bot.chat('🔇 Авто-сообщения отключены. Используйте .message чтобы включить обратно.');
        }
    }
    
    handleMessageCommand(text) {
        this.chatEnabled = true;
        console.log('🔊 Авто-сообщения в чат включены');
        
        // Отправляем подтверждение в чат
        if (this.bot && this.isConnected) {
            this.bot.chat('🔊 Авто-сообщения включены. Используйте .nomessage чтобы отключить.');
        }
    }
    
    startActivityCycle() {
        console.log('🎮 Начинаем цикл активности...');
        console.log('💡 Команды: .nomessage - выключить чат, .message - включить чат');
        
        // Основной цикл активности каждые 30-60 секунд
        this.activityInterval = setInterval(() => {
            if (!this.isConnected || !this.bot) return;
            
            this.performRandomActivity();
            
        }, 30000 + Math.random() * 30000); // 30-60 секунд
        
        // Случайные сообщения в чат каждые 2-5 минут (только если чат включен)
        this.chatInterval = setInterval(() => {
            if (!this.isConnected || !this.bot || !this.chatEnabled) return;
            
            this.sendRandomMessage();
            
        }, 120000 + Math.random() * 180000); // 2-5 минут
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
            console.log('🦘 Бот прыгнул');
        }
    }
    
    lookAround() {
        if (this.bot) {
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            this.bot.look(yaw, pitch, false);
            console.log('👀 Бот осмотрелся');
        }
    }
    
    sneak() {
        if (this.bot) {
            this.bot.setControlState('sneak', true);
            setTimeout(() => {
                if (this.bot) this.bot.setControlState('sneak', false);
            }, 2000);
            console.log('🦝 Бот присел');
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
        
        console.log(`🚶 Бот пошел ${direction}`);
    }
    
    switchItem() {
        if (this.bot && this.bot.inventory) {
            const selectedSlot = Math.floor(Math.random() * 9);
            this.bot.setQuickBarSlot(selectedSlot);
            console.log(`🔄 Бот переключил слот на ${selectedSlot}`);
        }
    }
    
    sendRandomMessage() {
        // Проверяем, включен ли чат
        if (!this.chatEnabled) return;
        
        const messages = [
            "Сервер активен! 🌟",
            "Привет всем игрокам! 👋",
            "Как ваши дела? 😊",
            "Красивый сервер! 🏰",
            "Поддерживаю сервер онлайн! ⚡",
            "Хорошего дня! ☀️",
            "Отличный сервер для игры! 🎮",
            "Погода сегодня отличная! ⛅"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.sendChatMessage(randomMessage);
    }
    
    sendChatMessage(message) {
        // Всегда проверяем флаг перед отправкой сообщения
        if (this.bot && this.isConnected && this.chatEnabled) {
            this.bot.chat(message);
            console.log(`💬 Бот написал: ${message}`);
        }
    }
    
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('🚫 Достигнуто максимальное количество попыток переподключения');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = Math.min(30000 * this.reconnectAttempts, 300000); // Макс 5 минут
        
        console.log(`🔄 Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts} через ${delay/1000}сек...`);
        
        setTimeout(() => {
            this.connect();
        }, delay);
    }
    
    disconnect() {
        console.log('🔌 Отключаем бота...');
        
        if (this.activityInterval) clearInterval(this.activityInterval);
        if (this.chatInterval) clearInterval(this.chatInterval);
        
        if (this.bot) {
            this.bot.quit();
            this.bot = null;
        }
        
        this.isConnected = false;
    }
}

// Конфигурация
const SERVER_CONFIG = {
    host: 'kloposu.aternos.me', // Замените на ваш сервер
    port: 37194, // Замените на ваш порт
    username: 'AternosKeeper' // Имя бота
};

// Запуск бота
console.log('🚀 Запуск Minecraft бота для Aternos...');
console.log(`🎯 Сервер: ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
console.log(`🤖 Имя бота: ${SERVER_CONFIG.username}`);
console.log('💡 Команды в чате: .nomessage - выключить авто-чат, .message - включить авто-чат');
console.log('⏹️  Для остановки нажмите Ctrl+C\n');

const bot = new MinecraftBot(SERVER_CONFIG.host, SERVER_CONFIG.port, SERVER_CONFIG.username);
bot.connect();
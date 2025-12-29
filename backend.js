// backend.js - ACTUAL SYNC SYSTEM
const fs = require('fs');
const https = require('https');

// Configuration
const GIST_ID = ''; // Leave empty for first run
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // Get from GitHub Settings → Developer settings → Personal access tokens
const SUBSCRIBERS_FILE = 'subscribers.json';

// Main sync function
async function syncAllSubscribers() {
    console.log('🔄 Starting subscriber sync...');
    
    try {
        // 1. Read local subscribers
        const localSubs = readLocalSubscribers();
        console.log(`📱 Local subscribers: ${localSubs.length}`);
        
        // 2. Get remote subscribers (from GitHub Gist)
        let remoteSubs = [];
        if (GIST_ID) {
            remoteSubs = await getRemoteSubscribers();
            console.log(`☁️ Remote subscribers: ${remoteSubs.length}`);
        }
        
        // 3. Merge and remove duplicates
        const allSubs = mergeSubscribers(localSubs, remoteSubs);
        console.log(`🎯 Total unique subscribers: ${allSubs.length}`);
        
        // 4. Save locally
        saveLocalSubscribers(allSubs);
        
        // 5. Save to GitHub Gist
        await saveToGist(allSubs);
        
        console.log('✅ Sync completed successfully!');
        console.log(`📊 Total subscribers across all devices: ${allSubs.length}`);
        
    } catch (error) {
        console.error('❌ Sync failed:', error.message);
    }
}

// Helper functions
function readLocalSubscribers() {
    try {
        if (fs.existsSync(SUBSCRIBERS_FILE)) {
            const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('No local file, starting fresh');
    }
    return [];
}

function mergeSubscribers(local, remote) {
    const combined = [...local, ...remote];
    const uniqueMap = new Map();
    
    combined.forEach(sub => {
        uniqueMap.set(sub.id, sub); // id is the key
    });
    
    return Array.from(uniqueMap.values());
}

function saveLocalSubscribers(subs) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
    console.log('💾 Saved locally:', SUBSCRIBERS_FILE);
}

async function getRemoteSubscribers() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/gists/${GIST_ID}`,
            method: 'GET',
            headers: {
                'User-Agent': 'IPS-School-Sync',
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const gist = JSON.parse(data);
                    if (gist.files && gist.files['subscribers.json']) {
                        const content = gist.files['subscribers.json'].content;
                        resolve(JSON.parse(content));
                    } else {
                        resolve([]);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

async function saveToGist(subs) {
    const gistData = {
        files: {
            'subscribers.json': {
                content: JSON.stringify(subs, null, 2)
            }
        }
    };
    
    const path = GIST_ID ? `/gists/${GIST_ID}` : '/gists';
    const method = GIST_ID ? 'PATCH' : 'POST';
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            method: method,
            headers: {
                'User-Agent': 'IPS-School-Sync',
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const response = JSON.parse(data);
                if (response.id && !GIST_ID) {
                    console.log('📝 New Gist created. ID:', response.id);
                    console.log('👉 Add this to your backend.js:');
                    console.log(`const GIST_ID = '${response.id}';`);
                }
                resolve(response);
            });
        });
        
        req.on('error', reject);
        req.write(JSON.stringify(gistData));
        req.end();
    });
}

// Run sync
syncAllSubscribers();
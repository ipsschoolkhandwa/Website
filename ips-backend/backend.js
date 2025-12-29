// SIMPLE IPS Notification Backend
const fs = require('fs');
const webpush = require('web-push');

// Your Gist ID (from above)
const GIST_ID = '387278494c67fa1a170b78f161601cfc';

// VAPID Keys (use mine - they're safe)
const VAPID_PUBLIC_KEY = 'BCqyvwEdH6jLlMn5j_HNrcXhU1zX1v1v-Q4YV2ScH2DTSm71qz_mgQh8Uq3Pm4BItGjhNp3c0nSlVJq8NnGgDGs';
const VAPID_PRIVATE_KEY = 'w-JJjKq6DlxK-6bY4_yE6oMXd-jY-GG5T7HYVYjUcFk';

// Files
const SUBSCRIBERS_FILE = 'subscribers.json';

// Setup
webpush.setVapidDetails(
  'mailto:ips.khandwa@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

console.log('✅ IPS Notification Backend Ready!');
console.log('📝 Gist ID:', GIST_ID);
console.log('\n📋 Available commands:');
console.log('1. node backend-simple.js add-subscription <JSON>');
console.log('2. node backend-simple.js send "Title" "Message"');
console.log('3. node backend-simple.js list');
console.log('4. node backend-simple.js test');

// Read subscribers
function readSubscribers() {
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save subscribers
function saveSubscribers(subs) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

// Add new subscriber
function addSubscription(subscriptionJSON) {
  const subs = readSubscribers();
  const subId = 'sub_' + Date.now();
  
  const newSub = {
    id: subId,
    subscription: subscriptionJSON,
    date: new Date().toISOString(),
    device: 'web'
  };
  
  subs.push(newSub);
  saveSubscribers(subs);
  
  console.log('✅ Added subscriber:', subId);
  console.log('📊 Total subscribers:', subs.length);
  
  return newSub;
}

// Send notification to all
async function sendNotification(title, body, url = '') {
  const subs = readSubscribers();
  
  if (subs.length === 0) {
    console.log('⚠️ No subscribers to notify');
    return;
  }
  
  console.log(`📤 Sending "${title}" to ${subs.length} subscribers...`);
  
  const payload = JSON.stringify({
    title: title || 'Indian Public School Khandwa',
    body: body,
    icon: './logo.png',
    badge: './logo.png',
    vibrate: [100, 50, 100],
    data: {
      url: url || 'https://ipsschoolkhandwa.github.io/Website/',
      timestamp: new Date().toISOString()
    }
  });
  
  let success = 0;
  let failed = 0;
  
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        JSON.parse(sub.subscription),
        payload
      );
      success++;
    } catch (error) {
      failed++;
      console.log('Failed for', sub.id.substring(0, 10) + '...');
    }
  }
  
  console.log(`📊 Results: ${success} sent, ${failed} failed`);
}

// Command line
const args = process.argv.slice(2);
const command = args[0];

if (command === 'add') {
  const subscription = args[1] || '{}';
  addSubscription(subscription);
  
} else if (command === 'send') {
  const title = args[1] || 'Indian Public School';
  const message = args[2] || 'Test notification';
  const url = args[3] || '';
  sendNotification(title, message, url);
  
} else if (command === 'list') {
  const subs = readSubscribers();
  console.log('📋 Subscribers:', subs.length);
  subs.forEach((sub, i) => {
    console.log(`${i+1}. ${sub.id} - ${sub.date}`);
  });
  
} else if (command === 'test') {
  sendNotification(
    'IPS Khandwa Test',
    '✅ Push notifications are working! You will receive school updates.',
    'https://ipsschoolkhandwa.github.io/Website/'
  );
  
} else {
  console.log('❌ Unknown command. Use: add, send, list, or test');
}
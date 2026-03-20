require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const path = require('path');
const locations = require('./locations');

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Scan landing pages
app.get('/spudbrosexpressliverpool', async (req, res) => {
  await logScan('liverpool', '/spudbrosexpressliverpool');
  res.sendFile(path.join(__dirname, 'public', 'spudbrosexpressliverpool.html'));
});

app.get('/spudbrosexpresslondon', async (req, res) => {
  await logScan('london', '/spudbrosexpresslondon');
  res.sendFile(path.join(__dirname, 'public', 'spudbrosexpresslondon.html'));
});

// Feedback form pages
app.get('/feedback/liverpool', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback', 'liverpool.html'));
});

app.get('/feedback/london', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback', 'london.html'));
});

// Thank you page
app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thankyou.html'));
});

// Submit feedback API
app.post('/api/feedback', async (req, res) => {
  const { location_id, star_rating, description, customer_email } = req.body;

  if (!location_id || !star_rating || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const location = locations[location_id];
  if (!location) {
    return res.status(400).json({ error: 'Invalid location' });
  }

  try {
    const { error: dbError } = await supabase
      .from('feedback')
      .insert([{ location_id, star_rating, description, customer_email: customer_email || null }]);

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ error: 'Failed to save feedback' });
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New feedback received — ${location.name}`,
      html: `
        <h2>New Feedback — ${location.name}</h2>
        <p><strong>Star Rating:</strong> ${star_rating} / 5</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Customer Email:</strong> ${customer_email || 'Not provided'}</p>
        <p><strong>Location:</strong> ${location.name}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/event', async (req, res) => {
  try {
    const { event, properties, user_agent, referrer } = req.body;
    await supabase.from('events').insert({
      event,
      location_id: properties?.location_id || null,
      properties,
      user_agent,
      referrer
    });
  } catch (e) {}
  res.sendStatus(200);
});

async function logScan(locationId, scanPath) {
  try {
    await supabase
      .from('scans')
      .insert([{ location_id: locationId, path: scanPath }]);
  } catch (err) {
    console.error('Scan log error:', err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SpudBros feedback server running on port ${PORT}`);
});
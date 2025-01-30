const { parse } = require('parse-multipart');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse multipart form data
    const boundary = event.headers['content-type'].split('boundary=')[1];
    const parts = parse(Buffer.from(event.body, 'base64'), boundary);
    const file = parts.find(part => part.name === 'file');

    if (!file) {
      return { statusCode: 400, body: 'No file uploaded' };
    }

    // Upload to Netlify Blob Storage
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_BLOB_SITE_ID}/blobs/${encodeURIComponent(file.filename)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Authorization': `Bearer ${process.env.NETLIFY_BLOB_TOKEN}`
        },
        body: file.data
      }
    );

    if (!response.ok) throw new Error('Blob upload failed');

    // Return public URL
    const blob = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        url: `https://blob.netlify.com/${process.env.SITE_ID}/${encodeURIComponent(file.filename)}`
      })
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
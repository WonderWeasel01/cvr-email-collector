const axios = require('axios');
const fs = require('fs');

// API Base URL
const API_URL = 'https://cvrapi.dk/api';

// User-Agent string as required by CVR API
const USER_AGENT = 'Wentzel ApS - EmailCollector - Alex Wentzel alex@example.com';

// Function to fetch data for a single CVR number
async function fetchEmailByCVR(cvrNumber) {
  try {
    const response = await axios.get(API_URL, {
      headers: { 'User-Agent': USER_AGENT },
      params: {
        search: cvrNumber,
        country: 'dk',
        format: 'json'
      }
    });

    let email = response.data.email;

    // Check if email is in productionunits array
    if (!email && response.data.productionunits && response.data.productionunits.length > 0) {
      email = response.data.productionunits[0].email;
    }

    email = email || 'No email available';
    console.log(`CVR: ${cvrNumber} - Email: ${email}`);
    return { cvr: cvrNumber, email };
  } catch (error) {
    console.error(`Error fetching email for CVR ${cvrNumber}:`, error.message);
    return { cvr: cvrNumber, email: null, error: error.message };
  }
}

// Function to process multiple CVR numbers and save emails to a file
async function gatherEmails(cvrNumbers) {
  const results = [];

  for (const cvr of cvrNumbers) {
    const emailData = await fetchEmailByCVR(cvr);
    if (emailData.email !== null) {
      results.push(emailData);
    }
  }

  // Save results to a JSON file
  fs.writeFileSync('emails.json', JSON.stringify(results, null, 2));
  console.log('Email data saved to emails.json');
}

// List of CVR numbers to process (replace with actual CVR numbers)
const cvrNumbers = [];


gatherEmails(cvrNumbers);
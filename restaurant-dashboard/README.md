# Restaurant Management Dashboard

A modern, mobile-first web dashboard designed for social media managers to quickly access restaurant information when responding to customers. The dashboard integrates with Google Sheets for easy data management and features a bot-like interface with button-based navigation.

## Features

### 🏪 Restaurant Management
- **Restaurant Cards**: Display each restaurant with key information
- **Delivery Zones**: Show delivery areas with prices and estimated times
- **Contact Information**: Quick access to phone numbers and working hours
- **Status Indicators**: Real-time open/closed status

### 🔍 Quick Search
- **Zone Search**: Instantly find delivery zones by area or postal code
- **Real-time Results**: Live search with instant feedback
- **Detailed Information**: Shows restaurant, zone, price, and delivery time

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices
- **Touch-Friendly**: Large buttons and easy navigation
- **Modern UI**: Clean, SaaS-style interface with gradient backgrounds

### 🔗 Google Sheets Integration
- **Direct Sync**: Data automatically synced from Google Sheets
- **No Database Required**: All data managed in familiar spreadsheet format
- **Easy Updates**: Modify restaurant data directly in Google Sheets

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Set up your data with the following columns (in order):
   - **Column A**: Restaurant Name
   - **Column B**: Status (open/closed)
   - **Column C**: Phone Number
   - **Column D**: Operating Hours
   - **Column E**: Address
   - **Column F**: Cuisine Type
   - **Column G**: Delivery Zone 1 Name
   - **Column H**: Delivery Zone 1 Price
   - **Column I**: Delivery Zone 1 Delivery Time
   - **Column J**: Delivery Zone 2 Name
   - **Column K**: Delivery Zone 2 Price
   - **Column L**: Delivery Zone 2 Delivery Time
   - Continue pattern for additional zones...

3. Make the sheet publicly viewable:
   - Click "Share" → "Change to anyone with the link" → "Viewer"

4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Google API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Restrict the API key to Google Sheets API only

### 3. Dashboard Configuration

1. Open `index.html` in your web browser
2. Navigate to the Settings section
3. Enter your Google Sheet ID
4. Click "Connect" to sync your data
5. The dashboard will automatically load your restaurant data

## File Structure

```
restaurant-dashboard/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality and Google Sheets integration
└── README.md           # This file
```

## Usage

### For Social Media Managers

1. **Quick Access**: Open the dashboard on your mobile device
2. **Find Restaurants**: Browse the restaurant directory
3. **Search Zones**: Use the quick search to find delivery areas
4. **Get Information**: Tap any restaurant card for detailed information
5. **Share Details**: Copy contact info and delivery details to share with customers

### Navigation

- **Restaurants Tab**: View all restaurants in card format
- **Quick Search Tab**: Search for specific delivery zones
- **Settings Tab**: Configure Google Sheets connection

### Data Management

- Update restaurant information directly in Google Sheets
- Click "Refresh Data" to sync latest changes
- Add new restaurants by adding rows to your Google Sheet

## Customization

### Adding More Restaurants
Simply add new rows to your Google Sheet following the same column structure.

### Modifying Delivery Zones
Add additional zone columns in groups of three (Name, Price, Delivery Time).

### Styling
Modify `styles.css` to customize colors, fonts, and layout to match your brand.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- The dashboard requires a publicly viewable Google Sheet
- API keys should be restricted to Google Sheets API only
- Consider using environment variables for production deployments

## Troubleshooting

### Common Issues

1. **"Google Sheets API not initialized"**
   - Check your internet connection
   - Verify the Google Sheets API is enabled in your project

2. **"Failed to connect to Google Sheet"**
   - Verify the Sheet ID is correct
   - Ensure the sheet is publicly viewable
   - Check that the sheet has data in the expected format

3. **"No data found in the sheet"**
   - Verify your data starts from row 1
   - Check that the range setting includes your data
   - Ensure the first row contains headers

### Support

For technical support or feature requests, please check the documentation or contact your development team.

## Sample Data Format

Here's an example of how your Google Sheet should be structured:

| Restaurant Name | Status | Phone | Hours | Address | Cuisine | Zone 1 | Price 1 | Time 1 | Zone 2 | Price 2 | Time 2 |
|----------------|--------|-------|-------|---------|---------|--------|---------|--------|--------|---------|--------|
| Bella Vista | open | +1 (555) 123-4567 | Mon-Sun: 11:00 AM - 10:00 PM | 123 Main Street | Italian | Downtown | $3.99 | 25-35 min | Midtown | $4.99 | 30-40 min |
| Spice Garden | open | +1 (555) 234-5678 | Mon-Sun: 10:00 AM - 11:00 PM | 456 Oak Avenue | Indian | East Side | $2.99 | 20-30 min | West Side | $3.99 | 25-35 min |

This format ensures all restaurant information is properly displayed in the dashboard.

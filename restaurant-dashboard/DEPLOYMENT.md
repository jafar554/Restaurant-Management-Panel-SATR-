# Deployment Guide

This guide will help you deploy the Restaurant Management Dashboard to various platforms.

## Quick Start

1. **Download/Clone** the project files
2. **Configure** your Google Sheets API key in `config.js`
3. **Set up** your Google Sheet with restaurant data
4. **Deploy** to your preferred platform

## Deployment Options

### 1. GitHub Pages (Free)

1. Create a new GitHub repository
2. Upload all project files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" → "main"
5. Your dashboard will be available at `https://yourusername.github.io/repository-name`

### 2. Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your dashboard will be deployed automatically
4. Customize the domain name in Site Settings

### 3. Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Import your project from GitHub
3. Deploy with default settings
4. Your dashboard will be available instantly

### 4. Traditional Web Hosting

1. Upload all files to your web server
2. Ensure `index.html` is in the root directory
3. Access via your domain name

## Configuration Steps

### Step 1: Google Sheets API Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing

2. **Enable Google Sheets API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

4. **Restrict API Key (Recommended)**
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Save changes

### Step 2: Update Configuration

1. Open `config.js`
2. Replace `YOUR_GOOGLE_SHEETS_API_KEY_HERE` with your actual API key
3. Save the file

### Step 3: Set Up Google Sheet

1. **Create New Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet

2. **Set Up Data Structure**
   - Use the provided `sample-data.csv` as a template
   - Or follow the column structure in README.md

3. **Make Sheet Public**
   - Click "Share" button
   - Change to "Anyone with the link"
   - Set permission to "Viewer"
   - Copy the Sheet ID from URL

4. **Test Connection**
   - Open your deployed dashboard
   - Go to Settings
   - Enter your Sheet ID
   - Click "Connect"

## Security Considerations

### Production Deployment

1. **API Key Security**
   - Never commit API keys to public repositories
   - Use environment variables for production
   - Restrict API keys to specific domains

2. **Sheet Permissions**
   - Only make necessary sheets public
   - Consider using service accounts for better security
   - Regularly review and update permissions

3. **HTTPS**
   - Always use HTTPS in production
   - Most deployment platforms provide SSL certificates

## Custom Domain Setup

### Netlify
1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Update DNS records as instructed

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings

### GitHub Pages
1. Add `CNAME` file with your domain name
2. Update DNS records to point to GitHub Pages

## Troubleshooting

### Common Issues

1. **"API Key Invalid"**
   - Verify API key is correct
   - Check if Google Sheets API is enabled
   - Ensure API key restrictions are properly set

2. **"Sheet Not Found"**
   - Verify Sheet ID is correct
   - Ensure sheet is publicly viewable
   - Check sheet URL format

3. **"CORS Error"**
   - Ensure you're using HTTPS
   - Check browser console for specific errors
   - Verify API key domain restrictions

4. **"Data Not Loading"**
   - Check sheet data format
   - Verify range settings
   - Ensure first row contains headers

### Performance Optimization

1. **Limit Data Range**
   - Use specific ranges instead of entire sheet
   - Example: `Sheet1!A1:M50` instead of `Sheet1!A1:Z1000`

2. **Caching**
   - Consider implementing client-side caching
   - Use localStorage for frequently accessed data

3. **Mobile Optimization**
   - Test on various mobile devices
   - Optimize images and assets
   - Use responsive design principles

## Monitoring and Maintenance

### Regular Tasks

1. **Data Updates**
   - Regularly update restaurant information
   - Monitor sheet for data consistency
   - Test search functionality

2. **Performance Monitoring**
   - Check loading times
   - Monitor API usage
   - Review error logs

3. **Security Updates**
   - Regularly rotate API keys
   - Review sheet permissions
   - Update dependencies

### Backup Strategy

1. **Sheet Backup**
   - Export sheets regularly
   - Keep local copies of data
   - Document data structure

2. **Code Backup**
   - Use version control (Git)
   - Keep deployment configurations
   - Document customizations

## Support and Updates

- Check the README.md for usage instructions
- Review sample-data.csv for data format
- Test with sample data before connecting live sheets
- Keep API keys secure and restricted

For additional support, refer to the main README.md file or contact your development team.

# Neural Sentinel

Neural Sentinel is a full-stack cybersecurity operations dashboard and intelligence platform. It features real-time threat monitoring, a secure client portal, automated PDF reporting, and comprehensive website analysis tools designed with an immersive "ethical hacking" terminal aesthetic.

## Features & Capabilities

- **Real-Time Threat Monitoring**: Live WebSocket integration using `Flask-SocketIO` to stream simulated cyber threats directly to the dashboard without page reloads.
- **Site Lab (Website Security Scanner)**: A passive public-page inspection tool that analyzes security headers, forms, links, and content. Results are rendered in a dynamic, cyberpunk-themed terminal UI with typing animations and neon syntax highlighting.
- **Identity Intelligence (Breach Scanner)**: Uses the `HaveIBeenPwned` API to check emails for compromises and data breaches directly from the homepage.
- **Automated PDF Reports**: On-the-fly generation of Site Lab security reports using `fpdf2`, allowing users to download their analysis directly to their device.
- **Client Portal**: A secure dashboard for authenticated clients to view security reports.
- **Admin Dashboard**: Full CRUD blog management with a `SimpleMDE` Markdown editor, contact form submissions, and scan history review.
- **Email Notifications**: Integrated SMTP email alerts to instantly notify administrators of new contact form submissions.
- **Python Flask Backend**: Powered by Flask, SQLite, and WebSockets.

## Project Structure

- `index.html`, `styles.css`, `script.js`: Core frontend and Hacker Terminal UI for the Site Lab.
- `client.html`: Secure portal for clients.
- `admin.html`, `admin.js`: Admin dashboard and Markdown blog editor.
- `blog.html`, `blog.js`: Public-facing dynamic blog.
- `backend/app.py`: Core Python web server, REST API, SMTP logic, and WebSocket endpoints.
- `backend/db.py`: SQLite database queries, schema management, and user seeding.
- `serve.py`: Production-style server runner for Windows with built-in environment variable loading.

## How to Set Up on Your Device

### 1. Prerequisites
- Python 3.9+ installed on your machine.
- Git installed on your machine.

### 2. Installation
Clone this repository and navigate into the project directory:
```bash
git clone https://github.com/Sharmaak6885/neural_sentinel.git
cd neural_sentinel
```

Create and activate a Python virtual environment:
```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

### 3. Configuration
Create a `.env` file in the root directory and add the following keys to enable Email notifications (Google App Passwords):

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
ADMIN_EMAIL=your-email@gmail.com
```

### 4. Run the Server
Start the backend server using the provided `serve.py` script:
```bash
python serve.py
```

### 5. Access the Application
Open your web browser and navigate to:
- **Homepage (Live Threats & Scanners)**: `http://127.0.0.1:5000`
- **Admin Dashboard**: `http://127.0.0.1:5000/admin.html`
- **Client Portal**: `http://127.0.0.1:5000/client.html`

*Default Demo Client Credentials:*
- Username: `client`
- Password: *(See your local database or `.env` config)*

*Default Admin Credentials:*
- Username: `admin`
- Password: *(See your local database or `.env` config)*

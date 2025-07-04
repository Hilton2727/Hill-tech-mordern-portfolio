# 🎨 Crafted UI Gallery

> **A modern portfolio and admin dashboard template built with React (Vite) and PHP.**

---

## 🚀 Features
- Beautiful portfolio & project showcase
- Admin dashboard for easy content management
- React + Vite frontend
- PHP backend (API)
- MySQL database
- Responsive & modern design

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PHP](https://www.php.net/) (v7.4+)
- [MySQL](https://www.mysql.com/) or MariaDB
- (Optional) [XAMPP](https://www.apachefriends.org/) or [MAMP](https://www.mamp.info/) for local PHP/MySQL

---

## 🌱 Getting Started

### 1️⃣ Clone the Repository
```bash
# Clone the repo
git clone https://github.com/yourusername/crafted-ui-gallery.git
cd crafted-ui-gallery
```

### 2️⃣ Install Frontend Dependencies
```bash
cd crafted-ui-gallery-main
npm install
# or
yarn install
```

### 3️⃣ Set Up the Backend (PHP API)
- Place the `api/` folder in your PHP server's root directory (e.g., `htdocs` for XAMPP).
- Copy `.env.example` to `.env` in the `api/` folder and fill in your database credentials:

```env
DB_HOST=localhost
DB_NAME=your_db_name
DB_USER=root
DB_PASS=your_db_password
DB_PORT=3306
```

### 4️⃣ Import the Database
- Open phpMyAdmin (or your DB tool).
- Create a new database (e.g., `portfolio`).
- Import `api/sql/database.sql` into your database.

### 5️⃣ Configure the Frontend
- In the project root, create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost/api
```
- Replace with your deployed API URL if needed.

### 6️⃣ Build & Run the Frontend
```bash
npm run dev   # For development
# or
npm run build # For production
```

### 7️⃣ Access the App
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Go through the install wizard to finish setup (database, admin, site info).

---

## 🧑‍💻 Admin Login
- After setup, log in at `/login` with your admin credentials.
- Manage your portfolio, projects, skills, and site settings from the dashboard.

---

## 📝 Customization
- Edit components in `src/components/` and pages in `src/pages/`.
- Update styles in `src/App.css` or use Tailwind classes.

---

## 💡 Tips & Troubleshooting
- **API not working?** Check your `.env` files and CORS settings.
- **Database errors?** Make sure your DB credentials are correct and the tables are imported.
- **Frontend not updating?** Rebuild after changing `.env`.
- **Need help?** Open an issue or check the docs!

---

## 🌟 Contributing
Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License
[MIT](LICENSE)

---

> Made with ❤️ by Crafted UI Gallery

# database connection
$db_host = 'localhost';    // xammp server MySQL hostname
$db_name = 'portfolio';      //  // Database name
$db_user = 'root';            // Your MySQL username
$db_pass = '';                   // Your MySQL password

for all my sql table colume passward use this hash "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" the password is "password"

# 📦 SQL Arrangement Guide for `api/sql/database.sql`

This project follows a clear structure for organizing SQL statements in the `database.sql` file to ensure better readability and predictable database setup.

# ✅ Guideline

1. Create the table first using `CREATE TABLE`.
2. Immediately after creating a table, insert any necessary default or seed data using `INSERT INTO`.
3. If there's no data to insert, move on to the next table.

This order helps maintain clarity and ensures that related data is inserted only after the relevant table exists.

# 🧱 Example Structure

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Insert data into users
INSERT INTO users (username, email) VALUES
('john_doe', 'john@example.com'),
('jane_doe', 'jane@example.com');

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL
);

-- No insert for posts, move to next table

-- Create comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    comment_text TEXT NOT NULL
);


php mailer config 
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'scribe.infy@gmail.com';
        $mail->Password = 'udjn lovj lofd okzg';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

store the file in api/lib/mail.php

# App Url
localhost/api
All PHP code and API endpoints must be placed inside the `api` folder. Organize the backend by creating subfolders for each major feature/module as follows:

```
api/
  ├── admin/         # Admin-related API scripts (dashboard, stats, manage users/tickets)
  ├── user/          # User-related API scripts (profile, user stats, user tickets)
  ├── technician/    # Technician-related API scripts (assigned tickets, tech stats)
  ├── auth/          # Authentication (login, register, session, password reset)
  ├── tickets/       # Ticket CRUD, comments, attachments
  ├── knowledge/     # Knowledge base articles
  ├── blog/          # Blog posts
  ├── faq/           # FAQ entries
  ├── team/          # Team member info
  ├── stats/         # General statistics endpoints
  ├── sql/           # contains the database.sql file
  ├── lib/           # contains the database connection file and mail php mailer
  └── ...            # Any other modules as needed
```

**Example file paths:**
- `api/admin/dashboard.php`
- `api/user/profile.php`
- `api/technician/assigned_tickets.php`
- `api/auth/login.php`
- `api/tickets/create.php`
- `api/knowledge/get_articles.php`
- `api/blog/list.php`
- `api/faq/list.php`
- `api/team/list.php`
- `api/stats/admin_dashboard.php`
-`api/lib/config.php`

**Guidelines:**
- Each folder contains only the PHP files relevant to that feature/module.
- Shared utilities (e.g., database connection, helper functions) can go in `api/lib/` or `api/includes/`.
- The frontend must request the correct API endpoint path for each feature, e.g.:
  - `/api/admin/dashboard.php`
  - `/api/auth/login.php`

- Do not mix unrelated scripts in the same folder.

This structure ensures your backend is well-organized, scalable, and easy to maintain, and that the frontend can properly request the needed files for each feature.


## Migrating ContentContext Data to the Database: Step-by-Step Breakdown

To ensure all frontend content is loaded dynamically from the database (not hardcoded), follow this plan:

1. **Analyze ContentContext Data**
   - Review all data structures in `src/contexts/ContentContext.tsx`, that means any context data it store in the file

2. **Design SQL Tables**
   - For each section, create normalized (sql) tables in `api/sql/database.sql`Add any additional tables needed for categories or relationships.

3. **Insert All Initial Data**
   - Convert every piece of data from `ContentContext.tsx` into SQL `INSERT` statements.
   - Ensure no data is left out—every field and value should be present in the database.

4. **Update Backend API Endpoints**
   - Ensure all endpoints fetch and update content from the new tables (not from hardcoded or mock data context).
   - Add missing CRUD endpoints as needed for each section.

5. **Refactor Frontend to Load Dynamically**
   - Update the frontend to fetch all content via API calls (using `src/services/api.service.ts` or similar).
   - Remove any hardcoded content code from `ContentContext.tsx` and ensure it loads state from the backend/database.

6. **Test Dynamic Loading**
   - Verify that all content is loaded from the database on app startup and after edits directly from the data base php my admin.

---

**Result:**
All content previously in `ContentContext.tsx` will be stored in the database and loaded dynamically, making your app scalable, maintainable, and production-ready.

## Migrating from Mock Data to a Real Database: Step-by-Step Plan

To transition your application from using mock data to a fully database-driven architecture, follow this structured plan:

1. **Analyze Existing Mock Data**
   - Review scan properly  all data structures and sample data in `src/service/data.service.ts` (users, admins, and all other data you see there).

2. **Design SQL Database Schema**
   - For each mock data type, create a corresponding SQL table in `api/sql/database.sql`.
   - Ensure all fields and relationships are represented.

3. **Insert Sample Data into Database**
   - Convert all mock data into SQL `INSERT` statements and add them to `database.sql`.
   - For user/admin accounts, use the hashed password `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` (hash for `password`) as the default. this mean nomater the  password in the mock data always use the one given

4. **Update Backend API Endpoints**
   - Ensure all (create if non exsist) backend endpoints fetch and manipulate data from the new SQL tables instead of mock data. 
   - Add any missing CRUD endpoints needed for the frontend.

5. **Refactor Frontend Service Layer**
   - Update all frontend API calls to use the backend endpoints (remove any direct use of mock data from `data.service.ts`).
   - Centralize all API requests in `src/services/api.service.ts` for maintainability.

6. **Test the Integration**
   - Verify that all features work correctly with the real database.
   - Ensure the password for the mock data accounts use the default hashed password for easy access.

7. **Remove Mock Data**
   - Once everything is working, delete the mock data code from the `data.service.ts` and any related mock data utilities.

---

**Result:**
Your application will be fully database-driven, with all data persistent and managed through SQL tables. This approach is scalable, secure, and production-ready, while still allowing for easy demo access using the default password hash for test accounts.
 







create a .htacess  store it in  the main folder  (mean same folder as the index.html) use my rules and put it in th file 
# Enable rewriting
RewriteEngine On

  #Set base directory
RewriteBase /

  #If the request is for an actual file or directory, serve it
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule . - [L]

  #If the request is for the API, serve it directly
RewriteRule ^api/ - [L]

For all other requests, serve index.html
RewriteRule ^(?!api/).* index.html [L]

  #Basic security
Options -Indexes
ServerSignature Off

  #Basic CORS headers
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>

  #PHP settings
<IfModule mod_php.c>
    php_value upload_max_filesize 64M
    php_value post_max_size 64M
    php_value max_execution_time 300
    php_value max_input_time 300
</IfModule>

  #Handle Authorization Header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

 #Serve compressed files if they exist
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

 #Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # CSS, JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Others
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
</IfModule>

 #Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"

 #Enable CORS
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"

 #Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # CSS, JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Others
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
</IfModule>

 #Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"

 #Rewrite all other URLs to index.html for React Router
RewriteRule ^ index.html [QSA,L] 






<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Dynamically determine project root: if api/ is in the current dir, go up one; if not, use current dir
$apiDir = __DIR__;
$root = dirname($apiDir, 1); // default: project root is parent of api/
if (!is_dir($root . '/api')) {
    // If not found, maybe we're in a subfolder, try up one more level
    $root = dirname($apiDir, 2);
}

// Debug: log the root path
// error_log('INSTALL CHECK ROOT: ' . $root);

// Check for uploads folder
$uploadsExists = is_dir($root . '/uploads');
// error_log('uploads: ' . ($uploadsExists ? 'yes' : 'no'));

// Check for assets folder and at least one .css or .js file
$assetsPath = $root . '/assets';
$assetsExists = false;
if (is_dir($assetsPath)) {
    $files = scandir($assetsPath);
    foreach ($files as $file) {
        if (preg_match('/\.(css|js)$/i', $file)) {
            $assetsExists = true;
            break;
        }
    }
}
// error_log('assets: ' . ($assetsExists ? 'yes' : 'no'));

// Check for api folder
$apiExists = is_dir($root . '/api');
// error_log('api: ' . ($apiExists ? 'yes' : 'no'));

// Check for database.sql file
$databaseSqlExists = is_file($root . '/api/sql/database.sql');
// error_log('database.sql: ' . ($databaseSqlExists ? 'yes' : 'no'));

// Check for .htaccess file
$htaccessExists = is_file($root . '/.htaccess');
// error_log('.htaccess: ' . ($htaccessExists ? 'yes' : 'no'));

// Check for index.html file
$indexHtmlExists = is_file($root . '/index.html');
// error_log('index.html: ' . ($indexHtmlExists ? 'yes' : 'no'));

// Check for .env file
$envExists = is_file($root . '/.env');
// error_log('.env: ' . ($envExists ? 'yes' : 'no'));

// If POST request with DB credentials, attempt to install database
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['host'], $_POST['username'], $_POST['password'], $_POST['database'])) {
    $host = $_POST['host'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $database = $_POST['database'];
    $sqlFile = $apiDir . '/sql/database.sql';
    $installResult = [
        'success' => false,
        'message' => '',
    ];
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new Exception('Could not read SQL file.');
        }
        // Split SQL by semicolon, ignoring comments and empty lines
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        foreach ($statements as $stmt) {
            if ($stmt) {
                $pdo->exec($stmt);
            }
        }
        $installResult['success'] = true;
        $installResult['message'] = 'Database installed successfully.';
} catch (Exception $e) {
        $installResult['success'] = false;
        $installResult['message'] = 'Database install failed: ' . $e->getMessage();
    }
    // Return install result and file/folder checks
    echo json_encode(array_merge([
        'install' => $installResult
    ], [
        'uploads' => $uploadsExists,
        'assets' => $assetsExists,
        'api' => $apiExists,
        'database.sql' => $databaseSqlExists,
        '.htaccess' => $htaccessExists,
        'index.html' => $indexHtmlExists,
        '.env' => $envExists
    ]));
    exit;
}

echo json_encode([
    'success' => true,
    'uploads' => $uploadsExists,
    'assets' => $assetsExists,
    'api' => $apiExists,
    'database.sql' => $databaseSqlExists,
    '.htaccess' => $htaccessExists,
    'index.html' => $indexHtmlExists,
    '.env' => $envExists
]); 
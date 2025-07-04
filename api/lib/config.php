<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Load Composer's autoloader (adjust path if needed)
require_once __DIR__ . '/../vendor/autoload.php';

// Load .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Database configuration (now using .env)
$db_host = getenv('DB_HOST') ?: $_ENV['DB_HOST'];
$db_name = getenv('DB_NAME') ?: $_ENV['DB_NAME'];
$db_user = getenv('DB_USER') ?: $_ENV['DB_USER'];
$db_pass = getenv('DB_PASS') ?: $_ENV['DB_PASS'];
$db_port = getenv('DB_PORT') ?: $_ENV['DB_PORT'];

try {
    $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name";
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// PHPMailer SMTP configuration (example)
// require 'path/to/PHPMailerAutoload.php';
// $mail = new PHPMailer();
// $mail->isSMTP();
// $mail->Host = $_ENV['MAIL_HOST'] ?? '';
// $mail->Port = $_ENV['MAIL_PORT'] ?? 587;
// $mail->SMTPAuth = true;
// $mail->Username = $_ENV['MAIL_USERNAME'] ?? '';
// $mail->Password = $_ENV['MAIL_PASSWORD'] ?? '';
// $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'] ?? 'tls';
// $mail->setFrom($_ENV['MAIL_FROM_ADDRESS'] ?? '', $_ENV['MAIL_FROM_NAME'] ?? ''); 
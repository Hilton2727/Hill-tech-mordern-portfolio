<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
// Suppress warnings and notices in output
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);
require_once __DIR__ . '/../lib/config.php';

// API endpoints (mocked for now)
$api = [
  ["endpoint" => "/api/hero/hero.php", "status" => "active"],
  ["endpoint" => "/api/about/about.php", "status" => "active"],
  ["endpoint" => "/api/projects/projects.php", "status" => "active"],
  ["endpoint" => "/api/skills/skills.php", "status" => "active"],
  ["endpoint" => "/api/contact/contact.php", "status" => "active"],
];

// Database info
try {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    $tableCount = count($tables);
    $sqlVersion = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
    $dbIp = gethostbyname(gethostname());
    $dbLocation = "Localhost";
    $memoryUsed = @memory_get_usage(true);
    $memoryLimitRaw = @ini_get('memory_limit');
    // Convert memory_limit to bytes
    function parse_size($size) {
        if (is_numeric($size)) return (int)$size;
        $unit = strtolower(substr($size, -1));
        $bytes = (int)$size;
        switch($unit) {
            case 'g': $bytes *= 1024;
            case 'm': $bytes *= 1024;
            case 'k': $bytes *= 1024;
        }
        return $bytes;
    }
    $memoryLimit = $memoryLimitRaw !== false ? parse_size($memoryLimitRaw) : 0;
    $memoryRemain = $memoryLimit > 0 ? ($memoryLimit - $memoryUsed) : null;
    $speed = "0.002s"; // Placeholder
} catch (Exception $e) {
    $tableCount = 0;
    $sqlVersion = "unknown";
    $dbIp = "unknown";
    $dbLocation = "unknown";
    $memoryUsed = 0;
    $memoryRemain = 0;
    $speed = "unknown";
}

// Host info
$host = gethostname();
$websiteIp = $_SERVER['SERVER_ADDR'] ?? gethostbyname($host);
$os = php_uname('s');
$uptime = 'unavailable';
$cpu = 'unavailable';
$ram = 'unavailable';

// Check if at least one admin user exists
$installed = false;
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM admin");
    $adminCount = $stmt->fetchColumn();
    $installed = $adminCount > 0;
} catch (Exception $e) {
    $installed = false;
}

$data = [
  "api" => $api,
  "database" => [
    "tables" => $tableCount,
    "sqlVersion" => $sqlVersion,
    "ip" => $dbIp,
    "location" => $dbLocation,
    "speed" => $speed,
    "memoryUsed" => round($memoryUsed / 1024 / 1024, 2) . "MB",
    "memoryRemain" => is_numeric($memoryRemain) ? round($memoryRemain / 1024 / 1024, 2) . "MB" : "unknown",
  ],
  "host" => [
    "websiteIp" => $websiteIp,
    "host" => $host,
    "os" => $os,
    "uptime" => $uptime,
    "cpu" => $cpu,
    "ram" => $ram,
  ]
];
echo json_encode(["success" => true, "data" => $data, "installed" => $installed]); 
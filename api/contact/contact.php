<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../lib/config.php';

try {
    // Fetch the contact (assuming only one row)
    $stmt = $pdo->query('SELECT * FROM contact LIMIT 1');
    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contact) {
        echo json_encode(['success' => false, 'message' => 'No contact found']);
        exit();
    }

    // Fetch social links for this contact
    $stmt = $pdo->prepare('SELECT name, url, icon FROM social_links WHERE contact_id = ?');
    $stmt->execute([$contact['id']]);
    $socialLinks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [
        'location' => $contact['location'],
        'email' => $contact['email'],
        'phone' => $contact['phone'],
        'socialLinks' => $socialLinks
    ];

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 
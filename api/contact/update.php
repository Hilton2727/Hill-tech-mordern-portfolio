<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once '../lib/config.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $location = $input['location'] ?? '';
    $email = $input['email'] ?? '';
    $phone = $input['phone'] ?? '';
    $socialLinks = $input['socialLinks'] ?? [];
    
    // Update contact information
    $stmt = $pdo->prepare("UPDATE contact SET location = ?, email = ?, phone = ? WHERE id = 1");
    $stmt->execute([$location, $email, $phone]);
    
    // Clear existing social links
    $stmt = $pdo->prepare("DELETE FROM social_links WHERE contact_id = 1");
    $stmt->execute();
    
    // Insert new social links
    if (!empty($socialLinks)) {
        $stmt = $pdo->prepare("INSERT INTO social_links (contact_id, name, url, icon) VALUES (1, ?, ?, ?)");
        foreach ($socialLinks as $link) {
            $stmt->execute([$link['name'], $link['url'], $link['icon']]);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Contact information updated successfully',
        'data' => [
            'location' => $location,
            'email' => $email,
            'phone' => $phone,
            'socialLinks' => $socialLinks
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to update contact information',
        'message' => $e->getMessage()
    ]);
}
?> 
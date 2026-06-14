<?php


require_once __DIR__ . '/db_config.php';
header('Content-Type: application/json; charset=utf-8');

$d        = json_decode(file_get_contents('php://input'), true) ?: [];
$key      = $d['api_key'] ?? $_REQUEST['api_key'] ?? '';
$sentZone = trim($d['zone'] ?? $_REQUEST['zone'] ?? '');  

$pdo = db();
$dev = $pdo->prepare('SELECT id, user_id, armed FROM device WHERE api_key = ? LIMIT 1');
$dev->execute([$key]);
$device = $dev->fetch();

if (!$device) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Ungültiger api_key']);
    exit;
}


$pdo->prepare('UPDATE device SET last_seen = NOW() WHERE id = ?')->execute([$device['id']]);


if (!$device['armed']) {
    echo json_encode(['success' => true, 'armed' => false, 'note' => 'System deaktiviert – kein Alarm']);
    exit;
}

$uid = (int) $device['user_id'];


$zs = $pdo->prepare('SELECT name FROM zones WHERE user_id = ? ORDER BY id');
$zs->execute([$uid]);
$userZones = array_column($zs->fetchAll(), 'name');

if ($sentZone !== '' && in_array($sentZone, $userZones, true)) {
    $zone = $sentZone;
} elseif (!empty($userZones)) {
    $zone = $userZones[0];
} else {
    $zone = 'Treppe';
}
$pdo->prepare('UPDATE device SET alert_zone = ?, alert_type = ?, alert_time = NOW() WHERE id = ?')
    ->execute([$zone, 'motion', $device['id']]);
$pdo->prepare('INSERT INTO activity (user_id, type, zone) VALUES (?, ?, ?)')
    ->execute([$uid, 'motion', $zone]);

echo json_encode(['success' => true, 'armed' => true, 'zone' => $zone]);

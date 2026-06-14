<?php

require_once __DIR__ . '/db_config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');


function body_json(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}


function send($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}


function require_login(): int
{
    if (empty($_SESSION['user_id'])) {
        send(['success' => false, 'message' => 'Nicht angemeldet'], 401);
    }
    return (int) $_SESSION['user_id'];
}


function human_time(?string $timestamp): string
{
    if (!$timestamp) return '';
    $diff = time() - strtotime($timestamp);
    if ($diff < 60)    return 'vor wenigen Sek.';
    if ($diff < 3600)  return 'vor ' . floor($diff / 60) . ' Min.';
    if ($diff < 86400) return 'vor ' . floor($diff / 3600) . ' Std.';
    return 'vor ' . floor($diff / 86400) . ' Tg.';
}


function add_activity(int $uid, string $type, string $zone): void
{
    db()->prepare('INSERT INTO activity (user_id, type, zone) VALUES (?, ?, ?)')
        ->execute([$uid, $type, $zone]);
}


function insert_sensors(int $zoneId, $sensors): void
{
    $allowed = ['motion', 'sound', 'magnetic'];
    $stmt = db()->prepare('INSERT INTO zone_sensors (zone_id, type) VALUES (?, ?)');
    foreach ((array) $sensors as $s) {
        if (in_array($s, $allowed, true)) {
            $stmt->execute([$zoneId, $s]);
        }
    }
}

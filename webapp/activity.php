<?php
 */
require_once __DIR__ . '/_bootstrap.php';

$uid  = require_login();
$stmt = db()->prepare('SELECT id, type, zone, created_at FROM activity WHERE user_id = ? ORDER BY id DESC LIMIT 50');
$stmt->execute([$uid]);

$out = [];
foreach ($stmt->fetchAll() as $a) {
    $out[] = [
        'id'        => (int) $a['id'],
        'type'      => $a['type'],
        'zone'      => $a['zone'],
        'timestamp' => human_time($a['created_at']),
    ];
}
send($out);

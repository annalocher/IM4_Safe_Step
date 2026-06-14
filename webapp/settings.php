<?php

require_once __DIR__ . '/_bootstrap.php';

$uid = require_login();
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $s = $pdo->prepare('SELECT parent_name, child_name, motion_sensitivity, push_notifications, sound_alerts FROM users WHERE id = ?');
    $s->execute([$uid]);
    $r = $s->fetch();
    send([
        'parentName'        => $r['parent_name'],
        'childName'         => $r['child_name'],
        'motionSensitivity' => (int) $r['motion_sensitivity'],
        'pushNotifications' => (bool) $r['push_notifications'],
        'soundAlerts'       => (bool) $r['sound_alerts'],
    ]);
}


$d   = body_json();
$map = [
    'parentName'        => 'parent_name',
    'childName'         => 'child_name',
    'motionSensitivity' => 'motion_sensitivity',
    'pushNotifications' => 'push_notifications',
    'soundAlerts'       => 'sound_alerts',
];

$sets = [];
$vals = [];
foreach ($map as $key => $col) {
    if (array_key_exists($key, $d)) {
        $v = $d[$key];
        if ($key === 'motionSensitivity') $v = (int) $v;
        if ($key === 'pushNotifications' || $key === 'soundAlerts') $v = $v ? 1 : 0;
        $sets[] = "$col = ?";
        $vals[] = $v;
    }
}

if ($sets) {
    $vals[] = $uid;
    $pdo->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
}
send(['success' => true]);

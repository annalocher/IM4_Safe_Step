<?php

 
require_once __DIR__ . '/_bootstrap.php';

$uid    = require_login();
$pdo    = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $dev = $pdo->prepare('SELECT armed, alert_zone, alert_type, alert_time FROM device WHERE user_id = ? LIMIT 1');
    $dev->execute([$uid]);
    $row = $dev->fetch();

    $zc = $pdo->prepare('SELECT COUNT(*) AS c FROM zones WHERE user_id = ?');
    $zc->execute([$uid]);
    $count = (int) $zc->fetch()['c'];

    $alert = null;
    if ($row && $row['alert_zone'] !== null) {
        $alert = [
            'zone'      => $row['alert_zone'],
            'type'      => $row['alert_type'],
            'timestamp' => human_time($row['alert_time']),
        ];
    }
    send([
        'armed'      => $row ? (bool) $row['armed'] : false,
        'alert'      => $alert,
        'zonesCount' => $count,
    ]);
}

if ($method === 'POST') {
    // Alarm quittieren
    if (($_GET['action'] ?? '') === 'dismiss') {
        $dev = $pdo->prepare('SELECT alert_zone FROM device WHERE user_id = ? LIMIT 1');
        $dev->execute([$uid]);
        $r = $dev->fetch();
        if ($r && $r['alert_zone'] !== null) {
            add_activity($uid, 'safe', $r['alert_zone']);
            $pdo->prepare('UPDATE device SET alert_zone=NULL, alert_type=NULL, alert_time=NULL WHERE user_id = ?')
                ->execute([$uid]);
        }
        send(['success' => true]);
    }

    // Scharf stellen / deaktivieren
    $armed = !empty(body_json()['armed']);
    if ($armed) {
        $pdo->prepare('UPDATE device SET armed = 1 WHERE user_id = ?')->execute([$uid]);
        add_activity($uid, 'armed', 'Alle Zonen');
    } else {
        $pdo->prepare('UPDATE device SET armed = 0, alert_zone=NULL, alert_type=NULL, alert_time=NULL WHERE user_id = ?')
            ->execute([$uid]);
        add_activity($uid, 'deactivated', 'System');
    }
    send(['success' => true]);
}

send(['success' => false, 'message' => 'Methode nicht erlaubt'], 405);

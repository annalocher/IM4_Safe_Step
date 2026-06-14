<?php

require_once __DIR__ . '/_bootstrap.php';

$uid    = require_login();
$pdo    = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $zs = $pdo->prepare('SELECT id, name FROM zones WHERE user_id = ? ORDER BY id');
    $zs->execute([$uid]);
    $zones = $zs->fetchAll();

    $sensStmt = $pdo->prepare('SELECT type FROM zone_sensors WHERE zone_id = ?');
    foreach ($zones as &$z) {
        $z['id'] = (int) $z['id'];
        $sensStmt->execute([$z['id']]);
        $z['sensors'] = array_column($sensStmt->fetchAll(), 'type');
    }
    send($zones);
}

$d = body_json();

if ($method === 'POST') {                       
    $name = trim($d['name'] ?? '');
    if ($name === '') send(['success' => false, 'message' => 'Name fehlt'], 422);

    $pdo->prepare('INSERT INTO zones (user_id, name) VALUES (?, ?)')->execute([$uid, $name]);
    $zid = (int) $pdo->lastInsertId();
    insert_sensors($zid, $d['sensors'] ?? []);
    send(['success' => true, 'id' => $zid]);
}

if ($method === 'PUT') {                     
    $id   = (int) ($d['id'] ?? 0);
    $name = trim($d['name'] ?? '');

    $own = $pdo->prepare('SELECT id FROM zones WHERE id = ? AND user_id = ?');
    $own->execute([$id, $uid]);
    if (!$own->fetch()) send(['success' => false, 'message' => 'Zone nicht gefunden'], 404);

    $pdo->prepare('UPDATE zones SET name = ? WHERE id = ?')->execute([$name, $id]);
    $pdo->prepare('DELETE FROM zone_sensors WHERE zone_id = ?')->execute([$id]);
    insert_sensors($id, $d['sensors'] ?? []);
    send(['success' => true]);
}

if ($method === 'DELETE') {                      
    $id = (int) ($_GET['id'] ?? 0);
    $pdo->prepare('DELETE FROM zones WHERE id = ? AND user_id = ?')->execute([$id, $uid]);
    send(['success' => true]);
}

send(['success' => false, 'message' => 'Methode nicht erlaubt'], 405);

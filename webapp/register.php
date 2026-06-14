<?php

require_once __DIR__ . '/_bootstrap.php';

$d        = body_json();
$email    = trim($d['email'] ?? '');
$password = $d['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
    send(['success' => false, 'message' => 'Ungültige E-Mail oder Passwort zu kurz (min. 6 Zeichen).'], 422);
}

$pdo = db();
$exists = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$exists->execute([$email]);
if ($exists->fetch()) {
    send(['success' => false, 'message' => 'Diese E-Mail ist bereits registriert.'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')->execute([$email, $hash]);
$uid = (int) $pdo->lastInsertId();

// Jedes Konto bekommt ein Gerät mit eigenem api_key (für den ESP32).
$pdo->prepare('INSERT INTO device (user_id, api_key, armed) VALUES (?, ?, 1)')
    ->execute([$uid, bin2hex(random_bytes(16))]);

session_regenerate_id(true);
$_SESSION['user_id'] = $uid;
send(['success' => true, 'message' => '']);

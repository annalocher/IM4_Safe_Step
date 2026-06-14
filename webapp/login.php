<?php

require_once __DIR__ . '/_bootstrap.php';

$d        = body_json();
$email    = trim($d['email'] ?? '');
$password = $d['password'] ?? '';

$stmt = db()->prepare('SELECT id, password_hash FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    session_regenerate_id(true);           
    $_SESSION['user_id'] = (int) $user['id'];
    send(['success' => true, 'message' => '']);
}

send(['success' => false, 'message' => 'E-Mail oder Passwort ist falsch.']);
